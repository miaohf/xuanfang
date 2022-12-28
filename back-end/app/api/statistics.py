import re
from flask import request, jsonify, url_for, g
from app import db
from app.api import bp
from app.api.auth import token_auth
from app.api.errors import bad_request
from app.models import Houses, Gardens, Houseitems, Choices, Projects, Buildings, Customers, Boxes, Labelitems, Labels
from flask_babel import gettext as _
from datetime import datetime
from sqlalchemy import func
import time



@bp.route('/statistics', methods=['GET'])
@token_auth.login_required
def get_statistics():
    '''返回图书记录集合，分页'''

    page = request.args.get('page', 1, type=int)
    # per_page = min(request.args.get('per_page', 10, type=int), 100)
    per_page = request.args.get('limit', type=int)

    data = {}

    # start = time.time()

    houses_total =  Houses.query.count()
    houses_free =  Houses.query.filter(Houses.status == 0).count()

    labels_total =  Labels.query.count()
    labels_free =  Labels.query.filter(Labels.status == 0).count()

    Choices_total =  Choices.query.count()

    data['houses_total'] = houses_total
    data['houses_free'] = houses_free

    data['labels_total'] = labels_total
    data['labels_free'] = labels_free
    # data['Choices_total'] = Choices_total

    labelitems = Labelitems.query.order_by(Labelitems.area.desc()).all()
    # labelitems = Labelitems.query.order_by(Labelitems.garden_id.desc()).all()
    # labelitems = Labelitems.query.join(Gardens, Gardens.id == Labelitems.garden_id ).order_by(Gardens.daping_seq).all()
    details = []
    i = 1
    for labelitem in labelitems:
        detail = {}
        detail['id'] = str(i).zfill(2)
        detail['garden_name'] = labelitem.garden.name
        detail['area'] = "%.2f" % labelitem.area
        # detail['occupied'] = labelitem.occupied_count   #实际已选
        detail['occupied'] = labelitem.choices_count    #方案已选
        detail['total'] = labelitem.labels_count

        i += 1
        details.append(detail)
    
    data['details'] = details

    project = Projects.query.first()
    data['project_name'] = project.name


    return jsonify(data)



@bp.route('/projectinfo', methods=['GET'])
@token_auth.login_required
def get_project_statistics():

    project_statistics_items = Houses.query\
        .join(Houseitems, Houseitems.id == Houses.houseitem_id)\
        .join(Housetypes, Housetypes.id == Houseitems.housetype_id)\
        .join(Buildings, Buildings.id == Houses.building_id)\
        .join(Gardens, Gardens.id == Buildings.garden_id)\
        .with_entities(Gardens.id, Gardens.name, Houses.status, Housetypes.name, Buildings.name, func.count(Houses.id))\
        .group_by(Gardens.id, Gardens.name, Buildings.name, Housetypes.name, Houses.status)\
        .all() 

    items = []
    for ps in project_statistics_items:

        if ps[2] == 0:
            status = '空闲'
        else:
            status = '占用'

        item = {
            'garden_id': ps[0],
            'garden_name': ps[1],
            'status': status,
            'housetype': ps[3],
            'building_name': ps[4],
            'count': ps[5],
        }

        items.append(item)

    customers = Customers.query.all()
    customers_unchosen = 0
    for c in customers:
        if len(c.contracts) == 0:
            customers_unchosen += 1


    houses_total = Houses.query.count()
    houses_free = Houses.query.filter(Houses.status == 0).count()
    customers_total = Customers.query.count()


    data = {
        'items': items,
        'houses_total': houses_total,
        'houses_free': houses_free,
        'customers_total': customers_total,
        'customers_unchosen': customers_unchosen
    }

    return jsonify(data)