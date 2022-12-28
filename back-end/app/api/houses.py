import re
from flask import request, jsonify, url_for, g
from app import db
from app.api import bp
from app.api.auth import token_auth
from app.api.errors import bad_request
from app.models import Houses, Houseitems, Buildings, Units
from flask_babel import gettext as _
from datetime import datetime
from sqlalchemy import func
import random


@bp.route('/houses', methods=['POST'])
@token_auth.login_required
def create_house():
    '''创建一条图书记录'''
    data = request.get_json()
    print('data: ', data)
    if not data:
        return bad_request(_('You must post JSON data.'))

    message = {}
        
    if message:
        return bad_request(message)

    def get_housetype(area):
        if float(area) < 80:
            return 1
        elif float(area) < 100:
            return 2
        elif float(area) < 200:
            return 3
        else:
            return 4

    def get_houseitem(garden_id, box_id, area):
        houseitem = Houseitems.query\
            .filter(Houseitems.garden_id == garden_id)\
            .filter(Houseitems.area == area)\
            .first()
        
        if houseitem:
             return houseitem.id
        else:
            houseitem = Houseitems(
                garden_id = garden_id,
                area = area,
                box_id = box_id,
                housetype_id = get_housetype(area)
                )
            db.session.add(houseitem)
            db.session.commit()
            return houseitem.id
       


    house = Houses(
        houseitem_id = get_houseitem(data['garden_id'], data['garden_id'], data['area']),
        number = data['number'],
        sub_area = data['sub_area']
        )

    db.session.add(house)
    db.session.commit()
    response = jsonify(house.to_dict())
    # response.status_code = 201
    # # HTTP协议要求201响应包含一个值为新资源URL的Location头部
    # response.headers['Location'] = url_for('api.get_house', id=house.id)
    response.status_code = 200
    return response


@bp.route('/houses', methods=['GET'])
# @token_auth.login_required
def get_houses():
    '''返回图书记录集合，分页'''
    page = request.args.get('page', 1, type=int)
    # per_page = min(request.args.get('per_page', 10, type=int), 100)
    per_page = request.args.get('limit', type=int)
    # print(per_page)


    get_desc = 'orderby_lastupdate_desc' in request.args and request.args.get('orderby_lastupdate_desc') == 'true'
    get_status = 'status' in request.args and request.args.get('status') != ''
    get_number = 'number' in request.args and request.args.get('number') != ''
    get_activity = 'activity' in request.args and request.args.get('activity') != ''
    get_areaitem = 'areaitem_id' in request.args and request.args.get('areaitem_id') != ''
    get_garden = 'garden_id' in request.args and request.args.get('garden_id') != ''
    get_building = 'building_name' in request.args and request.args.get('building_name') != ''
    get_checkflag = 'check_flag' in request.args and request.args.get('check_flag') != ''
    get_multiflag = 'multi_flag' in request.args and request.args.get('multi_flag') != ''
    get_unit = 'unit_name' in request.args and request.args.get('unit_name') != ''
    get_randomint = 'randomint' in request.args and request.args.get('randomint') != ''

    
    conditions = []

    if get_status:
        status = request.args.get('status')
        conditions.append(('status', 'eq', status))

    if get_number:
        number = request.args.get('number')
        conditions.append(('number', 'eq', number))

    if get_building:
        building_name = request.args.get('building_name')
        buildingids = [id[0] for id in Buildings.query.filter(Buildings.name == building_name).with_entities(Buildings.id).all()]
        conditions.append(('building_id', 'in', buildingids))


    if get_unit:
        unit_name = request.args.get('unit_name')
        print('unit_name: ', unit_name)
        unitids = [id[0] for id in Units.query.filter(Units.name == unit_name).with_entities(Units.id).all()]
        houseitemids = [id[0] for id in Houseitems.query.filter(Houseitems.unit_id.in_(unitids)).with_entities(Houseitems.id).all()]
        conditions.append(('houseitem_id', 'in', houseitemids))

    if get_checkflag:
        check_flag = request.args.get('check_flag')
        conditions.append(('check_flag', 'eq', check_flag))

    if get_multiflag:
        multi_flag = request.args.get('multi_flag')
        conditions.append(('multi_flag', 'eq', multi_flag))

    if get_areaitem and get_garden:
        areaitem_id = request.args.get('areaitem_id')
        garden_id = request.args.get('garden_id')
        houseitemids = [id[0] for id in Houseitems.query.join(Buildings, Buildings.id == Houseitems.building_id).filter(Houseitems.areaitem_id == areaitem_id, Buildings.garden_id == garden_id).with_entities(Houseitems.id).all()]
        conditions.append(('houseitem_id', 'in', houseitemids))

    elif get_areaitem:
        areaitem_id = request.args.get('areaitem_id')
        houseitemids = [id[0] for id in Houseitems.query.filter(Houseitems.areaitem_id == areaitem_id).with_entities(Houseitems.id).all()]
        conditions.append(('houseitem_id', 'in', houseitemids))


    elif get_garden:
        garden_id = request.args.get('garden_id')
        houseitemids = [id[0] for id in Houseitems.query.join(Buildings, Buildings.id == Houseitems.building_id).filter(Buildings.garden_id == garden_id).with_entities(Houseitems.id).all()]
        conditions.append(('houseitem_id', 'in', houseitemids))



    # print(conditions)
    if get_randomint:
        randomint =  int(request.args.get('randomint'))
        print('get_randomint: ', randomint)
        per_page = request.args.get('randomint', type=int)
        query = Houses.dinamic_filter(conditions).order_by(func.random())

    else:    
        if get_desc:
            print('get_desc')
            query = Houses.dinamic_filter(conditions).order_by(Houses.id.desc())
        else:
            query = Houses.dinamic_filter(conditions).order_by(Houses.id)\

    data = Houses.to_collection_dict(query, page, per_page, 'api.get_houses')

    return jsonify(data)



@bp.route('/houses/<int:id>', methods=['GET'])
@token_auth.login_required
def get_house(id):
    '''返回一条图书记录'''
    print(id)
    house = Houses.query.get_or_404(id)
    print(house)
    return jsonify(house.to_dict())



@bp.route('/houses/<int:id>', methods=['PUT'])
@token_auth.login_required
def update_house(id):
    '''修改一条图书记录'''    
    print(id)
    data = request.get_json()
    if not data:
        return bad_request(_('You must post JSON data.'))

    message = {}
    if 'id' in data and not data.get('id', None):
        message['id'] = 'Please provide a valid id.'

    if message:
        return bad_request(message)

    house = Houses.query.get_or_404(id)

    house.from_dict(data)
    db.session.commit()

    return jsonify(house.to_dict())
    


@bp.route('/houses/<int:id>', methods=['DELETE'])
@token_auth.login_required
def delete_house(id):
    '''返回一条图书记录'''
    house = Houses.query.get_or_404(id)

    db.session.delete(house)
    db.session.commit()
    response = {'result': 'delete by house_id OK'}
    return jsonify(response)



@bp.route('/houseslist', methods=['GET'])
@token_auth.login_required
def get_houses_available():
    '''返回图书记录集合，分页'''

    houses = Houses.query.filter(Houses.status == 0).all()   
    houses_list = []
    for h in houses:
        house = {
        'id': h.id,
        'address': str(h.id) + ',' + h.building.garden.name + ',' + h.building.name + '幢,' + h.unit + '单元,' + h.number + '室,(' + str(h.houseitem.area) + '㎡)',
        }
        houses_list.append(house)
    data = {'items': houses_list}
    return jsonify(data)



@bp.route('/houses/count', methods=['GET'])
@token_auth.login_required
def get_houses_count():
    '''返回客户总数'''
    houses_count = Houses.query.filter(Houses.status == 9).count()
    data = {'houses_count': houses_count}
    return jsonify(data)



@bp.route('/houses/statistics', methods=['GET'])
@token_auth.login_required
def get_houses_statistics():
    '''返回客户总数'''
    houses = Houses.query.filter(Houses.status == 0).all()

    abclist = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L']

    data = {}
    for h in houses:
        
        if h.villagecomb.name not in data:
            data[h.villagecomb.name] = {}
        if h.building.garden.name not in data[h.villagecomb.name]:
            data[h.villagecomb.name][h.building.garden.name] = {}
        if h.houseitem.areaitem.name not in data[h.villagecomb.name][h.building.garden.name]:
            data[h.villagecomb.name][h.building.garden.name][h.houseitem.areaitem.name] = {}
        for i in abclist:
            if i not in data[h.villagecomb.name][h.building.garden.name][h.houseitem.areaitem.name]:
                data[h.villagecomb.name][h.building.garden.name][h.houseitem.areaitem.name][i] = 0
        if h.houseitem.area < 70:
            data[h.villagecomb.name][h.building.garden.name][h.houseitem.areaitem.name]['A'] += 1
        elif h.houseitem.area < 80:
            data[h.villagecomb.name][h.building.garden.name][h.houseitem.areaitem.name]['B'] += 1
        elif h.houseitem.area < 90:
            data[h.villagecomb.name][h.building.garden.name][h.houseitem.areaitem.name]['C'] += 1
        elif h.houseitem.area < 100:
            data[h.villagecomb.name][h.building.garden.name][h.houseitem.areaitem.name]['D'] += 1
        elif h.houseitem.area < 110:
            data[h.villagecomb.name][h.building.garden.name][h.houseitem.areaitem.name]['E'] += 1
        elif h.houseitem.area < 190:
            data[h.villagecomb.name][h.building.garden.name][h.houseitem.areaitem.name]['F'] += 1
        elif h.houseitem.area == 198:
            data[h.villagecomb.name][h.building.garden.name][h.houseitem.areaitem.name]['G'] += 1
        elif h.houseitem.area == 199:
            data[h.villagecomb.name][h.building.garden.name][h.houseitem.areaitem.name]['H'] += 1
        elif h.houseitem.area == 200:
            data[h.villagecomb.name][h.building.garden.name][h.houseitem.areaitem.name]['I'] += 1
        elif h.houseitem.area == 203:
            data[h.villagecomb.name][h.building.garden.name][h.houseitem.areaitem.name]['J'] += 1
        elif h.houseitem.area == 211:
            data[h.villagecomb.name][h.building.garden.name][h.houseitem.areaitem.name]['K'] += 1
        elif h.houseitem.area == 212:
            data[h.villagecomb.name][h.building.garden.name][h.houseitem.areaitem.name]['L'] += 1


    data = {'data': data}
    return jsonify(data)