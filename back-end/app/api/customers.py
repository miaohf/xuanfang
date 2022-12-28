import re
from flask import request, jsonify, url_for, g
from app import db
from app.api import bp
from app.api.auth import token_auth
from app.api.errors import bad_request
from app.models import Customers, Gardens, Houses, Houseitems, Villages, Areaitems
from flask_babel import gettext as _
from datetime import datetime
from sqlalchemy import func, nullslast
from sqlalchemy.exc import SQLAlchemyError

from itertools import combinations_with_replacement
# from decimal import Decimal
# import operator

import timeit, math, time
import pandas as pd

from multiprocessing import Process

from app.utils.kedaxunfei import generate_audio
from app.utils.kedaxunfei_mp3 import generate_audio_mp3


@bp.route('/customers', methods=['POST'])
@token_auth.login_required
def create_customer():
    '''创建一条图书记录'''
    data = request.get_json()
    print('data: ', data)
    if not data:
        return bad_request(_('You must post JSON data.'))

    message = {}

    print(data['address'])

    def get_village(village_name):
        village = Villages.query.filter(Villages.name == village_name).first()
        if village:
            return village.id
        else:
            village = Villages(name=village_name, company_id = 1)
            db.session.add(village)
            db.session.flush
            return village.id

    print(get_village(data['village']))


    if data['phone']:
        phone = data['phone']
    else:
        phone = None

    customer = Customers(
        customer_code = data['customer_code'],
        name = data['name'],
        phone = phone,
        cardid = data['cardid'],
        myarea = data['myarea'],
        myarea_remain = data['myarea'],
        village_id = get_village(data['village']),
        address = data['address']
        )

    db.session.add(customer)
    db.session.commit()
    response = jsonify(customer.to_dict())
    # # HTTP协议要求201响应包含一个值为新资源URL的Location头部
    # response.status_code = 200
    return response




@bp.route('/customers', methods=['GET'])
@token_auth.login_required
def get_customers():
    '''返回图书记录集合，分页'''
    page = request.args.get('page', 1, type=int)
    # per_page = min(request.args.get('per_page', 10, type=int), 100)
    per_page = request.args.get('limit', type=int)
    print('per_page: ', per_page, 'page: ', page)

    print(g.current_user)

    get_customer_code = 'customer_code' in request.args and request.args.get('customer_code') != ''
    get_batch_code = 'batch_code' in request.args and request.args.get('batch_code') != ''
    get_paged = 'paged' in request.args and request.args.get('paged') != ''
    get_customer_name = 'customer_name' in request.args and request.args.get('customer_name') != ''
    get_orderby = 'orderby' in request.args and request.args.get('orderby') != ''
    get_check_flag = 'check_flag' in request.args and request.args.get('check_flag') != ''
    get_village = 'village_id' in request.args and request.args.get('village_id') != ''
    get_choices_printed = 'choices_printed' in request.args and request.args.get('choices_printed') != 'false'

    remain_area_greater_twenty = 'remain_area_greater_twenty' in request.args and request.args.get('remain_area_greater_twenty') != 'false'


    if get_paged:
        paged = request.args.get('paged')
        if paged == 'false':
            print('per_page = 10000')
            per_page = 10000

    conditions = []

    # if g.current_user.village_id:
    #     conditions.append(('village_id', 'eq', g.current_user.village_id))

    if get_customer_code:
        keyword = request.args.get('customer_code')
        search_keyword = "%{}%".format(keyword)
        conditions.append(('customer_code', 'like', search_keyword))

    if get_customer_name:
        keyword = request.args.get('customer_name')
        search_keyword = "%{}%".format(keyword)
        conditions.append(('name', 'like', search_keyword))

    if get_village:
        village_id = request.args.get('village_id')
        conditions.append(('village_id', 'eq', village_id))

    if remain_area_greater_twenty:
        customers = Customers.query.all()
        customer_ids = []
        for c in customers:
            if float(c.myarea) - c.total_area >= 20:
                customer_ids.append(c.id)
        conditions.append(('id', 'in', customer_ids))


    if get_batch_code:
        batch_code = request.args.get('batch_code')
        conditions.append(('batch_code', 'eq', batch_code))


    if get_check_flag:
        check_flag = request.args.get('check_flag')
        conditions.append(('check_flag', 'eq', check_flag))

    if get_choices_printed:
        print('get_choices_printed')
        conditions.append(('choices_printed', 'eq', 1))


    # query = Customers.dinamic_filter(conditions).order_by(Customers.id.desc())
    if get_orderby:
        orderby = request.args.get('orderby')    
        if orderby == '1':
            # print('order by admission_sequence')
            query = Customers.dinamic_filter(conditions).order_by(Customers.admission_sequence)
        elif orderby == '2':
            # print('order by lottery_sequence')
            query = Customers.dinamic_filter(conditions).order_by(Customers.lottery_sequence)
        else:
            # print('order by id')
            query = Customers.dinamic_filter(conditions).order_by(Customers.id)
    else:
        print('order by id')
        query = Customers.dinamic_filter(conditions).order_by(Customers.id)
    data = Customers.to_collection_dict(query, page, per_page, 'api.get_customers')
    return jsonify(data)



@bp.route('/customers/<int:id>', methods=['GET'])
@token_auth.login_required
def get_customer(id):
    '''返回一条图书记录'''
    customer = Customers.query.get_or_404(id)
    print(customer)
    return jsonify(customer.to_dict())




@bp.route('/customers/code/<int:customer_code>', methods=['GET'])
@token_auth.login_required
def get_customer_bycode(customer_code):
    '''返回一条图书记录'''
    print('customer_code: ', customer_code)
    # customer = Customers.query.filter(Customers.customer_code == customer_code).first()
    customer = Customers.query.filter(Customers.customer_code == customer_code).first()
    return jsonify(customer.to_dict())



@bp.route('/customers/<int:id>', methods=['PUT'])
@token_auth.login_required
def update_customer(id):
    '''修改一条图书记录'''    
    # print(id)
    data = request.get_json()
    if not data:
        return bad_request(_('You must post JSON data.'))

    message = {}
    if 'id' in data and not data.get('id', None):
        message['id'] = 'Please provide a valid id.'

    if message:
        return bad_request(message)

    print(data)


    try:
        customer = Customers.query.get_or_404(id)
        customer.from_dict(data)
        db.session.commit()

        #         c.isprinted = 0
        if data.get('check_flag') == 1:
            customer.checkin_time = customer.last_update
        if data.get('check_flag') == 2:
            customer.checkout_time = customer.last_update
        db.session.commit()
        
        return jsonify(customer.to_dict())

    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        message['error'] = '数据库更新失败！输入的抽签序号 ' + str(data['lottery_sequence']) + ' 已经存在；'
        return jsonify(message)


@bp.route('/customers/<int:id>/choices', methods=['POST'])
@token_auth.login_required
def get_customer_choices(id):
    '''返回一条图书记录'''
    customer = Customers.query.get_or_404(id)

    data = {}
    
    def get_area_value(elem):
        return float(elem['area'])

    def get_over_value(elem):
        return float(elem['over'])

    def get_remain_value(elem):
        return float(elem['remain'])

    params = request.get_json()
    if not params:
        return bad_request(_('You must post JSON data.'))

    # print(params)

    start = timeit.default_timer()

    # 剩余可选面积
    effective_area = float(float(customer.myarea) - customer.total_area)

    areaitems = Areaitems.query.all()

    areaitems_max_area = {
        '小户型': 0,
        '中户型': 0,
        '大户型': 0,
        '特大户型': 0,
    }

    for areaitem in areaitems:
        for labelitem in areaitem.labelitems:
            if areaitem.labels_count - areaitem.choices_count > 0:
                areaitems_max_area[areaitem.name] = areaitems_max_area[areaitem.name] if areaitems_max_area[areaitem.name] > labelitem.area else labelitem.area

    # print("type(effective_area, areaitems_max_area['中户型']): ", type(effective_area), type(areaitems_max_area['中户型']))

    labelitems = Labelitems.query.filter(Labelitems.box_id.in_(params['boxes'])).all()
    # labelitems = Labelitems.query.filter(Labelitems.id > 121).all()
    labels_quantity = int(params['labels_quantity'])
    sources = []

    for labelitem in labelitems:
        # sources.append(labelitem.to_dict())
        sources.append(labelitem)

    def get_area_value(elem):
        # return elem['area']
        return elem.area

    choices_temp = []
    for combination in combinations_with_replacement(sources, labels_quantity): 
        choices = []
        combinations = list(combination)

        # 从大到小排序，很关键
        combinations.sort(key=get_area_value, reverse=True)
        
        areas = []
        total_area = 0
        labelitems = []
        for li in combinations:
            labelitems.append(li.to_dict())
            for labelarea in li.labelareas:
                areas.append(labelarea.area)
            total_area += li.area
        choices.append(total_area)
        choices.append(min(areas))
        choices.append(labelitems)
        choices_temp.append(choices)


    # print('len(choices_temp): ', len(choices_temp))
    # print(choices_temp)
    choices_for_customer = []
    if len(choices_temp) > 0:
        df = pd.DataFrame(choices_temp)  

        # 根据面积总和有多到少排序
        df = df.sort_values(by=0, ascending=False)

        # 魏塘首次删选

        # 以下针对仅1套方案规则
        # print("areaitems_max_area['小户型'] > effective_area: ", areaitems_max_area['小户型'], effective_area, areaitems_max_area['小户型'] > effective_area)
        if labels_quantity == 1:
            new_df = df.loc[     
                ( effective_area >= 20 )

                & ~(( areaitems_max_area['小户型'] > effective_area ) &
                (( effective_area - df[0] < 80) & (df[1] >= 80 )))

                & ~(( areaitems_max_area['中户型'] > effective_area ) &
                (( effective_area - df[0] < 100 ) & ( df[1] >= 100 )))
                ]

        else:
            # 以下针对两套及两套以上方案规则
            print('labels_quantity: ', labels_quantity)
            new_df = df.loc[
                # 除最后一套, 剩余面积必须大于20
                ( effective_area - df[0] + df[1] >= 20 )

                # 除最后一套, 如剩余面积小于80，最后一套不允许是中套或大套( >=80 )
                & ~( 
                ( areaitems_max_area['小户型'] > (effective_area - df[0] + df[1]) ) &              # 小户型数量 > 0 且 小户型中最大户型面积大于剩余面积
                ( effective_area - df[0] + df[1] < 80 ) & ( df[1] >= 80 ))

                # 除最后一套, 如剩余面积小于100，最后一套不允许是大套( >=100 )
                & ~( 
                ( areaitems_max_area['中户型'] > (effective_area - df[0] + df[1]) ) &              # 中户型数量 > 0 且 中户型中最大户型面积大于剩余面积
                ( effective_area - df[0] + df[1] < 100 ) & ( df[1] >= 100 ))
                ]

        choices = new_df.rename(columns={df.columns[0]:'total_area', df.columns[2]:'choices'}).to_dict('records')

        # print('choices: ', choices)

        # sort the list
        # key = lambda x: (x[1], x[2])
        # choices_for_customer.sort(key=operator.itemgetter(get_over_value, get_remain_value), reverse=True)
        # choices_for_customer.sort(key = lambda x: x[0]['total_area'])

        # choices_for_customer = []

        # 魏塘二次删选

        # 只能选一套的小区
        # only_one_garden_names = ['善东苑', '翡翠公馆', '善和苑', '枫南小镇']
        only_one_garden_names = ['善和苑2期']
        only_one_garden_ids = [id[0] for id in Gardens.query.filter(Gardens.name.in_(only_one_garden_names)).with_entities(Gardens.id).all()]
        print('only_one_garden_ids: ', only_one_garden_ids)

        for c in choices:
            notEnoughLabel = 0
            breakonlyone = 0
            count_by_garden = {}
            count_by_box = {}

            for labelitem in c['choices']:
                if labelitem['box_id'] in count_by_box:
                    count_by_box[labelitem['box_id']] += 1
                else:
                    count_by_box[labelitem['box_id']] = 1

            for labelitem in c['choices']:
                if labelitem['garden_id'] in count_by_garden:
                    count_by_garden[labelitem['garden_id']] += 1
                else:
                    count_by_garden[labelitem['garden_id']] = 1

            # 方案中号签数量超过剩余号签数量
            for item_b in count_by_box:
                box = Boxes.query.get(item_b)
                if count_by_box[item_b] > box.labels_count - box.choices_count:
                    notEnoughLabel = 1

            # 不满足只能选一套小区的规则
            for item_g in count_by_garden:
                if item_g in only_one_garden_ids and count_by_garden[item_g] > 1:
                    breakonlyone = 1

            if notEnoughLabel != 1 and breakonlyone != 1:  
                choices_for_customer.append(c)

    data['choices'] = choices_for_customer

    return jsonify(data)



@bp.route('/customerslist', methods=['GET'])
@token_auth.login_required
def get_customers_available():
    '''返回图书记录集合，分页'''

    customers = Customers.query.order_by(Customers.lottery_sequence).all()
    
    customers_list = []
    for c in customers:
        if c.myarea_remain >=20:
            customer = {
            'id': c.id,
            # 'name': str(c.customer_code).zfill(4) + ',' + str(c.lottery_sequence).zfill(4) + ',' + c.name + ',' + str(round(c.myarea_remain, 2)) + '㎡'
            'name': str(c.lottery_sequence).zfill(4) + ',' + c.name + ',' + str(round(c.myarea_remain, 2)) + '㎡',
            'has_restricted_house_selection': c.has_restricted_house_selection(c.lottery_sequence)
            }
            customers_list.append(customer)
    data = {'items': customers_list}
    return jsonify(data)



@bp.route('/customers/<int:id>', methods=['DELETE'])
@token_auth.login_required
def delete_customer(id):
    '''返回一条图书记录'''
    customer = Customers.query.get_or_404(id)


    db.session.delete(customer)
    db.session.commit()
    response = {'result': 'delete by customer_id OK'}
    return jsonify(response)



@bp.route('/customers/count', methods=['GET'])
@token_auth.login_required
def get_customers_count():
    '''返回客户总数'''
    customers_count = Customers.query.count()
    data = {'customers_count': customers_count}
    return jsonify(data)




@bp.route('/customers/callnumber', methods=['POST'])
@token_auth.login_required
def callnumber():
    '''语音叫号'''
    print('语音叫号')

    now = datetime.now()
    dt_now = now.strftime("%m%d%Y%H%M%S")

    data = request.get_json()
    if not data:
        return bad_request(_('You must post JSON data.'))

    start_number = int(data['start_number'])
    lottery_sequence = int(data['lottery_sequence'])
    offset = int(data['offset'])


    customers = Customers.query.filter(Customers.lottery_sequence >= lottery_sequence).order_by(Customers.lottery_sequence).all()

    if start_number != 0:
        text = "请"
        for c in customers[:offset]:
            text = text + "第" + str(c.lottery_sequence) + "号，"
        text = text + "上前准备。"
        customer_name = "_"
        customer_code = "_"
        uri = '/audios/' + 'start_audio' + '_' + str(start_number) + '_' + dt_now + '.mp3'

    else:
        text_demo = '请第{}号，{}准备。'
        customer = customers[offset]
        text = text_demo.format( customer.lottery_sequence, customer.name )
        customer_name = customer.name
        customer_code = customer.customer_code
        uri = '/audios/' + str(customer.customer_code) + '_' + dt_now + '.mp3'

    # text = "抽签马上开始，请1至10号上前准备。"
    # text = "欢迎使用九色鹿抽签管理系统"

    audio = {
        'text': text,
        'customer_name': customer_name,
        'customer_code': customer_code,
        'uri': uri,
        'audiotype': 1
    }

    print(text)

    output_file = '/var/www/xuanfang' + uri
    pcm_sequence = str(customer_code) + '_' + dt_now

    # voice_name = "x2_qianqian"    # 定制"欢迎使用九色鹿抽签管理系统"提示音, (最佳女声倩倩)
    # voice_name = "x2_chaoge"
    # voice_name = "x2_nannan"      # 童声
    # voice_name = "x2_guange"
    # voice_name = "x2_mingge"      # 明哥 比较温柔
    # voice_name = "x2_tiange"      # 天哥 比较硬朗
    # voice_name = "x2_xiaofeng"    # 晓峰 央视播音效果
    # voice_name = "x2_guange"      #  关哥 中规中举
    voice_name = "x2_xiaozhong"     # 当前最佳男声 小忠 
    
    # 创建子进程
    p = Process(target=generate_audio, args=(pcm_sequence, text, output_file, voice_name))
    p.start()

    # wait for generating audios
    # sleep(3)

    return jsonify(audio)



@bp.route('/customers/callnumberbycontrol', methods=['POST'])
@token_auth.login_required
def callnumberbycontrol():
    '''语音叫号'''
    print('语音叫号')

    now = datetime.now()
    dt_now = now.strftime("%m%d%Y%H%M%S")

    data = request.get_json()

    print(data)
    # if not data:
    #     return bad_request(_('You must post JSON data.'))

    customer_id = data['customer_id']
    text = data['text']
    customer = Customers.query.filter(Customers.id == customer_id).first()
    uri = '/audios/' + str(customer.customer_code) + '_' + dt_now + '.mp3'
    audio = {
        'text': text,
        'customer_name': customer.name,
        'customer_code': customer.customer_code,
        'uri': uri,
        'audiotype': 1,

    }

    print(text)

    output_file = '/var/www/fengtong' + uri
    pcm_sequence = str(customer.customer_code) + '_' + dt_now

    # voice_name = "x2_xiaozhong"   # 当前最佳男声 小忠
    voice_name = "x2_chaoge"        # 超哥
    
    # 创建子进程
    p = Process(target=generate_audio_mp3, args=(pcm_sequence, text, output_file, voice_name, 0))
    p.start()

    while p.is_alive():
        print('Process is alive, wait a minute ....')
        time.sleep(1)
    # generate_audio_mp3(pcm_sequence, text, output_file, voice_name, 0)

    customer.is_called += 1
    db.session.commit()
    
    return jsonify(audio)
