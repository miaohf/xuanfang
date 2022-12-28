import re, os
from flask import request, jsonify, url_for, g
from app import db
from app.api import bp
from app.api.auth import token_auth
from app.api.errors import bad_request
from app.models import Feefloats
from flask_babel import gettext as _
from datetime import datetime
from sqlalchemy import func

from pathlib import Path



@bp.route('/feefloats', methods=['GET'])
@token_auth.login_required
def get_feefloats():

	feefloats = Feefloats.query.all()
	data = {}

	for feefloat in feefloats:
		if feefloat.floors not in data:
			data[feefloat.floors] = []
			data[feefloat.floors].append(feefloat.value)
		else:
			data[feefloat.floors].append(feefloat.value)

	return jsonify(data)

