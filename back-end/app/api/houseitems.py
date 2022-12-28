import re
from flask import request, jsonify, url_for, g
from app import db
from app.api import bp
from app.api.auth import token_auth
from app.api.errors import bad_request
from app.models import Houseitems
from flask_babel import gettext as _
from datetime import datetime
from sqlalchemy import func



@bp.route('/houseitems/<int:id>', methods=['GET'])
@token_auth.login_required
def get_housitems(id):
    '''返回一条图书记录'''
    print(id)
    houseitems = Houseitems.query.get_or_404(id)
    print(houseitems)
    return jsonify(houseitems.to_dict())


