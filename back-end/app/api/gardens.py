import re
from flask import request, jsonify, url_for, g
from app import db
from app.api import bp
from app.api.auth import token_auth
from app.api.errors import bad_request
from app.models import Gardens
from flask_babel import gettext as _
from datetime import datetime
from sqlalchemy import func



@bp.route('/gardens', methods=['GET'])
@token_auth.login_required
def get_gardens():
    '''返回图书记录集合，分页'''

    page = request.args.get('page', 1, type=int)
    # per_page = min(request.args.get('per_page', 10, type=int), 100)
    per_page = request.args.get('limit', type=int)
    print('per_page: ', per_page, 'page: ', page)

    conditions = []
    gardens = Gardens.query.all()
    
    query = Gardens.dinamic_filter(conditions).order_by(Gardens.id)
    data = Gardens.to_collection_dict(query, page, per_page, 'api.get_gardens')
    return jsonify(data)



@bp.route('/gardenslist', methods=['GET'])
@token_auth.login_required
def get_gardens_list():
    '''返回图书记录集合，分页'''

    gardens = Gardens.query.all()
    
    gardens_items = {}
    for g in gardens:
        garden = {
        'id': g.id,
        'name': g.name,
        'is_restricted': g.is_restricted
        }

        if g.incompatible_flag not in gardens_items:
            gardens_items[g.incompatible_flag] = []
        gardens_items[g.incompatible_flag].append(garden)

    print(gardens_items)
    data = {'items': gardens_items}
    return jsonify(data)
