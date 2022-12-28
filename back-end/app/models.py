from datetime import datetime, timedelta
from hashlib import md5
import json, time, jwt
from werkzeug.security import generate_password_hash, check_password_hash
from flask import url_for, current_app, g, jsonify
from app import db 
from sqlalchemy.inspection import inspect

from sqlalchemy.ext.hybrid import hybrid_property, hybrid_method

from dateutil import parser
from app.utils import getdatetime

from sqlalchemy import DECIMAL, UniqueConstraint

# from sqlalchemy import event, DDL

# import sys

# sys.setrecursionlimit(34)



users_roles = db.Table(
    'users_roles',
    db.Column('user_id', db.Integer, db.ForeignKey('users.id')),
    db.Column('role_id', db.Integer, db.ForeignKey('roles.id')),
    db.PrimaryKeyConstraint('user_id', 'role_id'),
)



class Serializer(object):
    def serialize(self):
        return {c: getattr(self, c) for c in inspect(self).attrs.keys()}

    # @staticmethod
    # def serialize_list(l):
    #     return [m.serialize() for m in l]



class PaginatedAPIMixin(object):
    @staticmethod
    def to_collection_dict(query, page, per_page, endpoint, **kwargs):
        resources = query.paginate(page, per_page, False)
        data = {
            'items': [item.to_dict() for item in resources.items],
            '_meta': {
                'page': page,
                'per_page': per_page,
                'total_pages': resources.pages,
                'total_items': resources.total
            },
            '_links': {
                'self': url_for(endpoint, page=page, per_page=per_page,
                                **kwargs),
                'next': url_for(endpoint, page=page + 1, per_page=per_page,
                                **kwargs) if resources.has_next else None,
                'prev': url_for(endpoint, page=page - 1, per_page=per_page,
                                **kwargs) if resources.has_prev else None
            }
        }
        return data

    def to_collection_dict_for_list(query, page, per_page, endpoint, **kwargs):
        resources = query.paginate(page, per_page, False)
        data = {
            'items': [item.to_dict_for_list() for item in resources.items],
            '_meta': {
                'page': page,
                'per_page': per_page,
                'total_pages': resources.pages,
                'total_items': resources.total
            },
            '_links': {
                'self': url_for(endpoint, page=page, per_page=per_page,
                                **kwargs),
                'next': url_for(endpoint, page=page + 1, per_page=per_page,
                                **kwargs) if resources.has_next else None,
                'prev': url_for(endpoint, page=page - 1, per_page=per_page,
                                **kwargs) if resources.has_prev else None
            }
        }
        return data


class Users(PaginatedAPIMixin, Serializer, db.Model):
    __table_args__ = {'sqlite_autoincrement': True}

    id = db.Column(db.Integer(), primary_key=True, autoincrement=True)
    username = db.Column(db.String(64))
    company = db.Column(db.String(64))
    password_hash = db.Column(db.String(128))  # 不保存原始密码
    name = db.Column(db.String(64))
    openid = db.Column(db.String(128))
    avatarurl = db.Column(db.String(64))
    nickname = db.Column(db.String(64))
    location = db.Column(db.String(64))
    about_me = db.Column(db.Text())
    status = db.Column(db.Integer, default=1) # 状态 0初始, 1正常
    member_since = db.Column(db.DateTime(), default=datetime.now)
    last_seen = db.Column(db.DateTime(), default=datetime.now)
    login_counts = db.Column(db.Integer, default=0)


    notifications = db.relationship('Notification', backref='user',
                                    lazy='dynamic', cascade='all, delete-orphan')

    def __repr__(self):
        return '<User {}>'.format(self.username)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def avatar(self, size):
        '''头像'''
        if self.email:
            digest = md5(self.email.lower().encode('utf-8')).hexdigest()
            avatar = 'https://www.gravatar.com/avatar/{}?d=identicon&s={}'.format(digest, size)
        else:
            avatar = None
        return avatar

    @classmethod
    def dinamic_filter(model_class, filter_condition):
        __query = db.session.query(model_class)
        for raw in filter_condition:
            try:
                key, op, value = raw
            except ValueError:
                raise Exception('Invalid filter: %s' % raw)
            column = getattr(model_class, key, None)
            if not column:
                raise Exception('Invalid filter column: %s' % key)
            if op == 'in':
                if isinstance(value, list):
                    filt = column.in_(value)
                else:
                    filt = column.in_(value.split(','))
            else:
                try:
                    attr = list(filter(lambda e: hasattr(column, e % op), ['%s', '%s_', '__%s__']))[0] % op
                except IndexError:
                    raise Exception('Invalid filter operator: %s' % op)
                if value == 'null':
                    value = None
                filt = getattr(column, attr)(value)
            __query = __query.filter(filt)
        return __query

    @staticmethod
    def serialize_list_for_role(l):
        return [m.authority for m in l]

    @staticmethod
    def serialize_list(l):
        return [m.to_dict() for m in l]

    @staticmethod
    def get_role_name(l):
        return [r.name for r in l]

    def to_dict(self, include_email=False):
        data = {
            'id': self.id,
            'username': self.username,
            'name': self.name,
            'role_name': self.get_role_name(self.roles),
            'login_counts': self.login_counts,
            'roles': self.serialize_list_for_role(self.roles),
            'location': self.location,
            'about_me': self.about_me,
            'status': self.status,
            'member_since': self.member_since.isoformat() + 'Z',
            'last_seen': self.last_seen.isoformat() + 'Z',
            '_links': {
                'self': url_for('api.get_user', id=self.id),
                # 'avatar': self.avatar(128)
            }
        }
        if include_email:
            data['email'] = self.email
        return data

    def from_dict(self, data, new_user=False):
        for field in ['username', 'email', 'name', 'phone', 'location', 'about_me', 'status']:
            if field in data:
                setattr(self, field, data[field])
        if new_user and 'password' in data:
            self.set_password(data['password'])

    def ping(self):
        self.last_seen = datetime.utcnow()

        print(self.login_counts)
        self.login_counts += 1
        print(self.login_counts)

        db.session.commit()

    def get_jwt(self, expires_in=7200):
        now = datetime.now()
        payload = {
            'user_id': self.id,
            'name': self.name if self.name else self.username,
            'exp': now + timedelta(seconds=expires_in),
            'iat': now
        }
        # return jwt.encode(
        #     payload,
        #     current_app.config['SECRET_KEY'],
        #     algorithm='HS256').decode('utf-8')

        # AttributeError: 'str' object has no attribute 'decode'
        # data = str(data) has already converted data to a string and then you're trying to decode it again using data.decode(utf-8').
        # The solution is simple, simply remove the data = str(data) statement (or remove the decode statement and simply do print(data))

        return jwt.encode(
            payload,
            current_app.config['SECRET_KEY'],
            algorithm='HS256')

    @staticmethod
    def verify_jwt(token):
        try:
            payload = jwt.decode(
                token,
                current_app.config['SECRET_KEY'],
                algorithms=['HS256'])
        except jwt.exceptions.ExpiredSignatureError as e:
            print(e)
            return None
            
        return Users.query.get(payload.get('user_id'))

    def add_notification(self, name, data):
        '''给用户实例对象增加通知'''
        # 如果具有相同名称的通知已存在，则先删除该通知
        self.notifications.filter_by(name=name).delete()
        # 为用户添加通知，写入数据库
        n = Notification(name=name, payload_json=json.dumps(data), user=self)
        db.session.add(n)
        return n



class Roles(db.Model):  
    __table_args__ = {'sqlite_autoincrement': True}

    id = db.Column(db.Integer(), primary_key=True, autoincrement=True)
    name = db.Column(db.String(32))
    authority = db.Column(db.String(32))
    create_at = db.Column(db.DateTime(), default=datetime.now)
    last_update = db.Column(db.DateTime(), onupdate=datetime.now, default=datetime.now)

    # users = db.relationship('User', backref='role')
    users = db.relationship('Users', secondary=users_roles, backref=db.backref('roles'))

    def __repr__(self):
        return '<Role {}>'.format(self.name)



class Notification(db.Model):  
    __table_args__ = {'sqlite_autoincrement': True}

    id = db.Column(db.Integer(), primary_key=True, autoincrement=True)
    name = db.Column(db.String(128))
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    timestamp = db.Column(db.Float, index=True, default=datetime.now)
    payload_json = db.Column(db.Text)

    def __repr__(self):
        return '<Notification {}>'.format(self.id)

    def get_data(self):
        return json.loads(str(self.payload_json))


    def to_dict(self):
        data = {
            'id': self.id,
            'name': self.name,
            'user': {
                'id': self.user.id,
                'username': self.user.username,
                'name': self.user.name,
                'avatar': self.user.avatar(128)
            },
            'timestamp': self.timestamp,
            'payload': self.get_data(),
            '_links': {
                'self': url_for('api.get_notification', id=self.id),
                'user_url': url_for('api.get_user', id=self.user_id)
            }
        }
        return data

    def from_dict(self, data):
        for field in ['body', 'timestamp']:
            if field in data:
                setattr(self, field, data[field])




class Villages(db.Model):
    id = db.Column(db.Integer(), primary_key=True, autoincrement=True)
    name = db.Column(db.String(200), nullable=False)
    create_at = db.Column(db.DateTime, nullable=False, default=datetime.now)
    last_update = db.Column(db.DateTime, onupdate=datetime.now)

    customers = db.relationship('Customers', backref='village', lazy='dynamic')


    
    def __repr__(self):
        return "{}".format(self.name)



class Customers(PaginatedAPIMixin, Serializer, db.Model):
    __table_args__ = (
        # UniqueConstraint('cardid','batch_code'), 
        # UniqueConstraint('admission_sequence','batch_code'), 
        # UniqueConstraint('lottery_sequence','batch_code'), 
        )
    id = db.Column(db.Integer(), primary_key=True, autoincrement=True)
    customer_code = db.Column(db.String(8))
    name = db.Column(db.String(20), nullable=False)
    cardid = db.Column(db.String(20), nullable=True)
    sub_name = db.Column(db.String(20))
    sub_cardid = db.Column(db.String(20), nullable=True)
    
    admission_sequence = db.Column(db.Integer) # 入场号
    lottery_sequence = db.Column(db.Integer)   # 抽签顺序号

    choices_printed =  db.Column(db.Integer, default = 0)  # 1预选方案已打印
    bill_is_updated =  db.Column(db.Integer, default = 0)  # 1结算单已更新

    myarea = db.Column(db.Float(), nullable=False)
    population = db.Column(db.Integer, default=0)  # 总人数
    population_aa = db.Column(db.Integer, default=0)  # 农业户籍 Agricultural
    population_na = db.Column(db.Integer, default=0)  # 非农户籍 None Agricultural
    population_ao = db.Column(db.Integer, default=0)  # 农业独子 Agricultural and Only child
    population_no = db.Column(db.Integer, default=0)  # 非农独子 None Agricultural and Only child

    jianzhu_area = db.Column(db.Float())                    # 核定建筑面积
    population_area = db.Column(db.Float(), default = 0)    # 标准安置面积 
    myarea = db.Column(db.Float(), nullable=False)          # 确认安置面积
    myarea_remain = db.Column(db.Float(), nullable=False)

    phone = db.Column(db.String(13))
    address = db.Column(db.String(50))
    note = db.Column(db.String(100))
    create_at = db.Column(db.DateTime, nullable=False, default=datetime.now)
    last_update = db.Column(db.DateTime, onupdate=datetime.now)

    checkin_time = db.Column(db.DateTime)
    checkout_time = db.Column(db.DateTime)

    village_id = db.Column(db.Integer, db.ForeignKey('villages.id'), nullable=False)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'))

    def __repr__(self):
        return "{}".format(self.cardid)

    @staticmethod
    def serialize_list(l):
        return [m.to_dict() for m in l]

    @classmethod
    def dinamic_filter(model_class, filter_condition):
        __query = db.session.query(model_class)
        for raw in filter_condition:
            try:
                key, op, value = raw
            except ValueError:
                raise Exception('Invalid filter: %s' % raw)
            column = getattr(model_class, key, None)
            if not column:
                raise Exception('Invalid filter column: %s' % key)
            if op == 'in':
                if isinstance(value, list):
                    filt = column.in_(value)
                else:
                    filt = column.in_(value.split(','))
            else:
                try:
                    attr = list(filter(lambda e: hasattr(column, e % op), ['%s', '%s_', '__%s__']))[0] % op
                except IndexError:
                    raise Exception('Invalid filter operator: %s' % op)
                if value == 'null':
                    value = None
                filt = getattr(column, attr)(value)
            __query = __query.filter(filt)
        return __query


    def to_dict(self):
        data = {
            'id': self.id,
            'customer_code': self.customer_code,
            'admission_sequence': str(self.admission_sequence).zfill(4) if self.admission_sequence else '-',
            'lottery_sequence': str(self.lottery_sequence).zfill(4) if self.lottery_sequence else '-',
            'name': self.name,
            'cardid': self.cardid,
            'sub_name': self.sub_name if self.sub_name else '-',
            'sub_cardid': self.sub_cardid if self.cardid else '-',
            'phone': self.phone if self.phone else '-',
            'population': self.population if self.population else '-',
            'myarea': '%.02f' % float(self.myarea),
            'myarea_remain': '%.02f' % float(self.myarea_remain),
            'village': self.village.name,
            'address': self.address,            
            'note': self.note if self.note else '-',
            'create_at': self.create_at.isoformat() + 'Z',
            'last_update': self.last_update.isoformat() + 'Z' if self.last_update else None,
            'checkin_time': self.checkin_time.isoformat() + 'Z' if self.checkin_time else None,
            'checkout_time': self.checkout_time.isoformat() + 'Z' if self.checkout_time else None,


            '_links': {
                'self': url_for('api.get_customer', id=self.id),
            }
        }
        # print('data: ', data)
        return data

    def from_dict(self, data):
        for field in ['admission_sequence', 'lottery_sequence', 'population', 'phone', 'check_flag', 'choices_printed']:
            if field in data:
                setattr(self, field, data[field])



class Gardens(db.Model, PaginatedAPIMixin, Serializer):
    id = db.Column(db.Integer(), primary_key=True, autoincrement=True)
    name = db.Column(db.String(200), nullable=False)
    short_name = db.Column(db.String(200))
    deliver_type = db.Column(db.Integer, default=0)                   # 0,期房 1,现房
    incompatible_flag = db.Column(db.Integer, default=0)              # 1,互斥（互斥的几个小区只能选择一个）
    is_restricted = db.Column(db.Integer, default=0)                  # 1 此小区只能选一套
    note = db.Column(db.String(200))
    create_at = db.Column(db.DateTime, nullable=False, default=datetime.now)
    last_update = db.Column(db.DateTime, onupdate=datetime.now)

    buildings = db.relationship('Buildings', backref='garden', lazy='dynamic')

    def __repr__(self):
        return "{}".format(self.name)

    @staticmethod
    def serialize_list(l):
        return [m.to_dict() for m in l]


    @classmethod
    def dinamic_filter(model_class, filter_condition):
        __query = db.session.query(model_class)
        for raw in filter_condition:
            try:
                key, op, value = raw
            except ValueError:
                raise Exception('Invalid filter: %s' % raw)
            column = getattr(model_class, key, None)
            if not column:
                raise Exception('Invalid filter column: %s' % key)
            if op == 'in':
                if isinstance(value, list):
                    filt = column.in_(value)
                else:
                    filt = column.in_(value.split(','))
            else:
                try:
                    attr = list(filter(lambda e: hasattr(column, e % op), ['%s', '%s_', '__%s__']))[0] % op
                except IndexError:
                    raise Exception('Invalid filter operator: %s' % op)
                if value == 'null':
                    value = None
                filt = getattr(column, attr)(value)
            __query = __query.filter(filt)
        return __query

    def to_dict(self):
        data = {
            'id': self.id,
            'name': self.name,
            'buildings': self.serialize_list(self.buildings),
            'is_restricted': self.is_restricted,
            'create_at': self.create_at.isoformat() + 'Z',
            'last_update': self.last_update.isoformat() + 'Z' if self.last_update else None,

        }
        return data



class Buildings(db.Model):
    id = db.Column(db.Integer(), primary_key=True, autoincrement=True)
    name = db.Column(db.String(200), nullable=False)
    build_type = db.Column(db.String(1), default=0)            # 0,多层 1,高层
    deliver_type = db.Column(db.String(1), default=0)          # 0,期房 1,现房 
    note = db.Column(db.String(200))    
    create_at = db.Column(db.DateTime, nullable=False, default=datetime.now)
    last_update = db.Column(db.DateTime, onupdate=datetime.now)

    garden_id = db.Column(db.Integer, db.ForeignKey('gardens.id'), nullable=False)

    units = db.relationship('Units', backref='building', lazy='dynamic')

    @staticmethod
    def serialize_list(l):
        return [m.to_dict() for m in l]

    def __repr__(self):
        return "{}".format(self.name)

    def to_dict(self):
        data = {
            'id': self.id,
            'name': self.name,
            'build_type': self.build_type,
            'deliver_type': self.deliver_type,

            'units': self.serialize_list(self.units),
            'create_at': self.create_at.isoformat() + 'Z',
            'last_update': self.last_update.isoformat() + 'Z' if self.last_update else None,

        }
        return data



# units, floors of buildings
class Units(db.Model):
    id = db.Column(db.Integer(), primary_key=True, autoincrement=True)
    name = db.Column(db.String(10), nullable=False)
    total_floors = db.Column(db.Integer())
    note = db.Column(db.String(200))    
    create_at = db.Column(db.DateTime, nullable=False, default=datetime.now)
    last_update = db.Column(db.DateTime, onupdate=datetime.now)

    building_id = db.Column(db.Integer, db.ForeignKey('buildings.id'), nullable=False)
    floors = db.relationship('Floors', backref='unit', lazy='dynamic')
    houses = db.relationship('Houses', backref='unit', lazy='dynamic')
    houseitems = db.relationship('Houseitems', backref='unit', lazy='dynamic')


    @staticmethod
    def serialize_list(l):
        data = [m.to_dict() for m in l]
        data.reverse()
        return data

    def __repr__(self):
        return "{}".format(self.name)

    def to_dict(self):
        data = {
            'id': self.id,
            'name': self.name,
            'floors': self.serialize_list(self.floors),
            'houseitems': self.serialize_list(self.houseitems),
            'create_at': self.create_at.isoformat() + 'Z',
            'last_update': self.last_update.isoformat() + 'Z' if self.last_update else None,

        }
        return data



# units, floors of buildings
class Floors(db.Model):
    id = db.Column(db.Integer(), primary_key=True, autoincrement=True)
    name = db.Column(db.String(10), nullable=False)
    note = db.Column(db.String(200))    
    create_at = db.Column(db.DateTime, nullable=False, default=datetime.now)
    last_update = db.Column(db.DateTime, onupdate=datetime.now)

    unit_id = db.Column(db.Integer, db.ForeignKey('units.id'), nullable=False)

    houses = db.relationship('Houses', backref='floor', lazy='dynamic')


    @staticmethod
    def serialize_list(l):
        return [m.to_dict() for m in l]

    def __repr__(self):
        return "{}".format(self.name)

    def to_dict(self):
        data = {
            'id': self.id,
            'name': self.name,
            'houses': self.serialize_list(self.houses),
            'create_at': self.create_at.isoformat() + 'Z',
            'last_update': self.last_update.isoformat() + 'Z' if self.last_update else None,

        }
        return data



class Areaitems(db.Model):
    id = db.Column(db.Integer(), primary_key=True, autoincrement=True)
    name = db.Column(db.String(200), nullable=False)
    keyname = db.Column(db.String(10))
    max_area = db.Column(db.String(10))
    note = db.Column(db.String(200))    
    create_at = db.Column(db.DateTime, nullable=False, default=datetime.now)
    last_update = db.Column(db.DateTime, onupdate=datetime.now)

    houseitems = db.relationship('Houseitems', backref='areaitem', lazy='dynamic')

    def __repr__(self):
        return "{}".format(self.name)



class Houseitems(db.Model, Serializer):
    id = db.Column(db.Integer(), primary_key=True, autoincrement=True)
    sequence = db.Column(db.Integer())
    area = db.Column(db.Float(precision=10, scale=2))
    note = db.Column(db.String(200))
    create_at = db.Column(db.DateTime, nullable=False, default=datetime.now)
    last_update = db.Column(db.DateTime, onupdate=datetime.now)

    areaitem_id = db.Column(db.Integer, db.ForeignKey('areaitems.id'), nullable=False)
    # floor_id = db.Column(db.Integer, db.ForeignKey('floors.id'), nullable=False)
    unit_id = db.Column(db.Integer, db.ForeignKey('units.id'), nullable=False)

    houses = db.relationship('Houses', backref='houseitem', lazy='dynamic')


    def __repr__(self):
        return "houseitem.{}".format(self.id)

    @staticmethod
    def serialize_list(l):
        return [m.to_dict() for m in l if m.status == 0]


    def to_dict(self):
        data = {
            'id': self.id,
            'sequence': self.sequence,
            'area': self.area,
            'areaitem_name': self.areaitem.name, 
            'create_at': self.create_at.isoformat() + 'Z',
            'last_update': self.last_update.isoformat() + 'Z' if self.last_update else None,

        }
        return data



class Houses(PaginatedAPIMixin, Serializer, db.Model):
    id = db.Column(db.Integer(), primary_key=True, autoincrement=True)
    house_code = db.Column(db.String(8))
    temp_house_code = db.Column(db.String(8))
    number = db.Column(db.String(20), nullable=False)
    sub_area = db.Column(db.Float(precision=10, scale=2))   
    feefloat = db.Column(db.Integer)
    status = db.Column(db.Integer, default=0)       #   0,空闲 1,已选 9,入库   
    note = db.Column(db.String(200))
    create_at = db.Column(db.DateTime, nullable=False, default=datetime.now)
    last_update = db.Column(db.DateTime, onupdate=datetime.now)

    unit_id = db.Column(db.Integer, db.ForeignKey('units.id'))
    floor_id = db.Column(db.Integer, db.ForeignKey('floors.id'))
    houseitem_id = db.Column(db.Integer, db.ForeignKey('houseitems.id'))
    customer_id = db.Column(db.Integer, db.ForeignKey('customers.id'))
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'))



    def __repr__(self):
        return "{}.{}.{}.{}.{}".format(self.id, self.houseitem.building.name, self.number, self.houseitem.area, self.houseitem.areaitem.name)

    @classmethod
    def dinamic_filter(model_class, filter_condition):
        __query = db.session.query(model_class)
        for raw in filter_condition:
            try:
                key, op, value = raw
            except ValueError:
                raise Exception('Invalid filter: %s' % raw)
            column = getattr(model_class, key, None)
            if not column:
                raise Exception('Invalid filter column: %s' % key)
            if op == 'in':
                if isinstance(value, list):
                    filt = column.in_(value)
                else:
                    filt = column.in_(value.split(','))
            else:
                try:
                    attr = list(filter(lambda e: hasattr(column, e % op), ['%s', '%s_', '__%s__']))[0] % op
                except IndexError:
                    raise Exception('Invalid filter operator: %s' % op)
                if value == 'null':
                    value = None
                filt = getattr(column, attr)(value)
            __query = __query.filter(filt)
        return __query


    def to_dict(self):
        data = {
            'id': self.id,
            'house_code': self.house_code,
            'status': self.status,
            'floor': self.floor.name,
            'feefloat': self.feefloat,
            'area': '%.02f' % float(self.houseitem.area), 
            'sub_area': '%.02f' % float(self.sub_area) if self.sub_area else '-',
            'number': self.number, 
            'garden_name': self.unit.building.garden.name,
            'building_name': self.unit.building.name,
            'unit': self.unit.name,
            'total_floors': self.unit.total_floors,
            'areaitem_keyname': self.houseitem.areaitem.keyname,
            'project_name': self.project.name if self.project else '-', 
            'create_at': self.create_at.isoformat() + 'Z',
            'last_update': self.last_update.isoformat() + 'Z' if self.last_update else None,
        }
        return data

    def from_dict(self, data):
        for field in ['check_flag']:
            if field in data:
                setattr(self, field, data[field])



class Feefloats(db.Model):
    id = db.Column(db.Integer(), primary_key=True, autoincrement=True)
    floors = db.Column(db.String(5))
    floor = db.Column(db.String(5))
    value = db.Column(db.Integer)

    create_at = db.Column(db.DateTime, nullable=False, default=datetime.now)
    last_update = db.Column(db.DateTime, onupdate=datetime.now)


    def __str__(self):
        return self.floors


    def to_dict(self):
        data = {
            'id': self.id,
            'floors': self.floors,
            'create_at': self.create_at.isoformat() + 'Z',

            '_links': {
                'self': url_for('api.get_box', id=self.id),
            }
        }
        return data



class Projects(db.Model):
    id = db.Column(db.Integer(), primary_key=True, autoincrement=True)
    name = db.Column(db.String(50))
    code = db.Column(db.String(10))
    create_at = db.Column(db.DateTime, nullable=False, default=datetime.now)
    last_update = db.Column(db.DateTime, onupdate=datetime.now)

    houses = db.relationship('Houses', backref='project', lazy='dynamic')
    customers = db.relationship('Customers', backref='project', lazy='dynamic')

   
    def __repr__(self):
        return "{}".format(self.message)



# class Slicesettings(db.Model):
#     id = db.Column(db.Integer(), primary_key=True, autoincrement=True)
#     garden_id = db.Column(db.Integer, db.ForeignKey('gardens.id'), nullable=False)
#     villagecomb_id = db.Column(db.Integer, db.ForeignKey('villagecombs.id'), nullable=False)
#     floor_area = db.Column(db.Float(), nullable=False)
#     quantity = db.Column(db.Integer, nullable=False)


