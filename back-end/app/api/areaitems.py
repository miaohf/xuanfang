import re
from flask import request, jsonify, url_for, g
from app import db
from app.api import bp
from app.api.auth import token_auth
from app.api.errors import bad_request
from app.models import Areaitems
from flask_babel import gettext as _
from datetime import datetime
from sqlalchemy import func



@bp.route('/areaitems', methods=['GET'])
@token_auth.login_required
def get_areaitems():

    areaitems_max_area = {
        '小户型': 0,
        '中户型': 0,
        '大户型': 0,
        '特大户型': 0,
    }

    areaitems = Areaitems.query.all()
    for areaitem in areaitems:
        for labelitem in areaitem.labelitems:
            if areaitem.labels_count - areaitem.choices_count > 0:
                areaitems_max_area[areaitem.name] = areaitems_max_area[areaitem.name] if areaitems_max_area[areaitem.name] > labelitem.area else labelitem.area

    return jsonify(areaitems_max_area)


