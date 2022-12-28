import re
from flask import request, jsonify, url_for, g
from app import db
from app.api import bp
from app.api.auth import token_auth
from app.api.errors import bad_request
from app.models import Villages
from flask_babel import gettext as _
from datetime import datetime
from sqlalchemy import func



@bp.route('/villageslist', methods=['GET'])
@token_auth.login_required
def get_villages_list():
    '''返回图书记录集合，分页'''

    villages = Villages.query.all()
    
    villages_items = []
    for v in villages:
        village = {
        'id': v.id,
        'name': v.name,
        }

        villages_items.append(village)

    print(villages_items)
    data = {'items': villages_items}
    return jsonify(data)
