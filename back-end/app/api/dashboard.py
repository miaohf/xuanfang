import re
from flask import request, jsonify, url_for, g
from app import db
from app.api import bp
from app.api.auth import token_auth
from app.api.errors import bad_request
from app.models import Houses, Gardens, Buildings, Houseitems, Choices, Customers, Villages, Labels, Contracts
from flask_babel import gettext as _
from datetime import datetime
from sqlalchemy import func
import time
import math



@bp.route('/dashboard', methods=['GET'])
@token_auth.login_required
def get_charts_data():
	'''返回图书记录集合，分页'''

	customers = Customers.query.join(Villages, Customers.village_id == Villages.id).with_entities(func.count(Customers.id), Villages.name).group_by(Villages.name).all()
	customers_pin_chart = {
		'series': [],
		'chartoptions_labels': []
	}
	for c in customers:
		customers_pin_chart['series'].append(c[0])
		customers_pin_chart['chartoptions_labels'].append(c[1])

	houses_bar = Houses.query\
		.join(Houseitems, Houses.houseitem_id == Houseitems.id)\
		.join(Buildings, Houses.building_id == Buildings.id)\
		.join(Gardens, Buildings.garden_id == Gardens.id)\
		.with_entities(func.count(Houses.id), Gardens.short_name, Buildings.name).group_by(Gardens.short_name, Buildings.name).all()

	houses_bar_chart = {
		'series_data': [],
		'chartoptions_xaxis_categories': []
	}

	for h in houses_bar:
		houses_bar_chart['series_data'].append(h[0])
		houses_bar_chart['chartoptions_xaxis_categories'].append([h[1], h[2] + '幢'])

	houses_bar_stack = Houses.query\
		.join(Houseitems, Houses.houseitem_id == Houseitems.id)\
		.join(Buildings, Houses.building_id == Buildings.id)\
		.join(Gardens, Buildings.garden_id == Gardens.id)\
		.with_entities(func.count(Houses.id), Gardens.short_name, Houses.status).group_by(Gardens.short_name, Houses.status).all()

	temp_dict = {}
	for h in houses_bar_stack:
		if h[1] not in temp_dict:
			temp_dict[h[1]] = {}
		if h[2] == 0:
			temp_dict[h[1]]['free'] = h[0]
		if h[2] == 1:
			temp_dict[h[1]]['occupied'] = h[0]

	houses_bar_stack_chart = {
		'series_data_01': [],
		'series_data_02': [],
		'chartoptions_xaxis_categories': []
	}

	for i in temp_dict:
		if 'free' in temp_dict[i]:
			houses_bar_stack_chart['series_data_01'].append(temp_dict[i]['free'])
		else:
			houses_bar_stack_chart['series_data_01'].append(0)

		if 'occupied' in temp_dict[i]:
			houses_bar_stack_chart['series_data_02'].append(temp_dict[i]['occupied'])
			# total = temp_dict[i]['free'] + temp_dict[i]['occupied']
		else:
			houses_bar_stack_chart['series_data_02'].append(0)
		
		# houses_bar_stack_chart['chartoptions_xaxis_categories'].append(i + '共 ' + str(total) + ' 套')
		houses_bar_stack_chart['chartoptions_xaxis_categories'].append(i)



	houses = Houses.query.with_entities(func.count(Houses.id), Houses.check_flag).group_by(Houses.check_flag).all()
	labels = Labels.query.with_entities(func.count(Labels.id), Labels.check_flag).group_by(Labels.check_flag).all()
	customers01 = Customers.query.filter(Customers.batch_code=='01').with_entities(func.count(Customers.id), Customers.check_flag).group_by(Customers.check_flag).all()
	# customers02 = Customers.query.filter(Customers.batch_code=='02').with_entities(func.count(Customers.id), Customers.check_flag).group_by(Customers.check_flag).all()
	# customers03 = Customers.query.filter(Customers.batch_code=='03').with_entities(func.count(Customers.id), Customers.check_flag).group_by(Customers.check_flag).all()

	labels_check_in_chart = {
		'series_data_01': [],
		'series_data_02': [],
		'chartoptions_xaxis_categories': []
	}


	customers_check_in_chart = {
		'series_data_01': [],
		'series_data_02': [],
		'chartoptions_xaxis_categories': []
	}


	for h in houses:
		if h[1] == 0:
			labels_check_in_chart['series_data_01'].append(h[0])
		else:
			labels_check_in_chart['series_data_02'].append(h[0])

	for l in labels:
		if l[1] == 0:
			labels_check_in_chart['series_data_01'].append(l[0])
		else:
			labels_check_in_chart['series_data_02'].append(l[0])

	for c in customers01:
		if c[1] == 0:
			customers_check_in_chart['series_data_01'].append(c[0])
		else:
			customers_check_in_chart['series_data_02'].append(c[0])

	# for c in customers02:
	# 	if c[1] == 0:
	# 		customers_check_in_chart['series_data_01'].append(c[0])
	# 	else:
	# 		customers_check_in_chart['series_data_02'].append(c[0])

	# for c in customers03:
	# 	if c[1] == 0:
	# 		customers_check_in_chart['series_data_01'].append(c[0])
	# 	else:
	# 		customers_check_in_chart['series_data_02'].append(c[0])

	labels_check_in_chart['chartoptions_xaxis_categories'] = ['房源', '号签']
	customers_check_in_chart['chartoptions_xaxis_categories'] = ['户主01']


	customers = Customers.query.filter(Customers.is_done == 1).order_by(Customers.last_update).all()

	cusotmers_dict = {}
	for c in customers:
		k = (round(c.last_update.timestamp()//60 * 60, 0) + 28800)* 1000 		#8小时时差
		print(k)
		if k not in cusotmers_dict:
			cusotmers_dict[k] = 0
		cusotmers_dict[k] += 1

	cusotmers_list = []
	for i in cusotmers_dict:
		cusotmers_list.append([i, cusotmers_dict[i]])



	# contracts = Contracts.query.order_by(Contracts.create_at).all()

	# cusotmers_dict = {}
	# for c in contracts:
	# 	k = (round(c.last_update.timestamp()//60 * 60, 0) + 28800)* 1000 		#8小时时差
	# 	print(k)
	# 	if k not in cusotmers_dict:
	# 		cusotmers_dict[k] = 0
	# 	cusotmers_dict[k] += 1

	# cusotmers_list = []
	# for i in cusotmers_dict:
	# 	cusotmers_list.append([i, cusotmers_dict[i]])


	customers_stock_chart = {
		'data': cusotmers_list
	}


	# 房源状态统计
	houses = Houses.query.all()
	temp_house_status_chart = {}
	for h in houses:
		garden_id = h.houseitem.building.garden_id
		if garden_id not in temp_house_status_chart:
			temp_house_status_chart[garden_id] = {}
		if h.houseitem.area < 65:
			if 65 not in temp_house_status_chart[garden_id]:
				temp_house_status_chart[garden_id][65] =  {}
			if h.status not in temp_house_status_chart[garden_id][65]:
				temp_house_status_chart[garden_id][65][h.status] = 0
			temp_house_status_chart[garden_id][65][h.status] += 1

		elif h.houseitem.area < 80:
			if 80 not in temp_house_status_chart[garden_id]:
				temp_house_status_chart[garden_id][80] = {}
			if h.status not in temp_house_status_chart[garden_id][80]:
				temp_house_status_chart[garden_id][80][h.status] = 0
			temp_house_status_chart[garden_id][80][h.status] += 1

		elif h.houseitem.area < 90:
			if 90 not in temp_house_status_chart[garden_id]:
				temp_house_status_chart[garden_id][90] = {}
			if h.status not in temp_house_status_chart[garden_id][90]:
				temp_house_status_chart[garden_id][90][h.status] = 0
			temp_house_status_chart[garden_id][90][h.status] += 1

		elif h.houseitem.area < 100:
			if 100 not in temp_house_status_chart[garden_id]:
				temp_house_status_chart[garden_id][100] = {}
			if h.status not in temp_house_status_chart[garden_id][100]:
				temp_house_status_chart[garden_id][100][h.status] = 0
			temp_house_status_chart[garden_id][100][h.status] += 1

		elif h.houseitem.area < 110:
			if 110 not in temp_house_status_chart[garden_id]:
				temp_house_status_chart[garden_id][110] = {}
			if h.status not in temp_house_status_chart[garden_id][110]:
				temp_house_status_chart[garden_id][110][h.status] = 0
			temp_house_status_chart[garden_id][110][h.status] += 1

		else:
			if 120 not in temp_house_status_chart[garden_id]:
				temp_house_status_chart[garden_id][120] = {}
			if h.status not in temp_house_status_chart[garden_id][120]:
				temp_house_status_chart[garden_id][120][h.status] = 0
			temp_house_status_chart[garden_id][120][h.status] += 1

	print(temp_house_status_chart)

	house_status_chart = {
		'series_data_01': [],
		'series_data_02': [],
		'chartoptions_xaxis_categories': []
	}


	for garden_id in temp_house_status_chart:
		if garden_id == 1:
			garden_flag = 'H2'
		elif garden_id == 2:
			garden_flag = 'H3'
		else:
			garden_flag = 'X'
		for area in temp_house_status_chart[garden_id]:
			for status in temp_house_status_chart[garden_id][area]:
				key = str(garden_flag) + '_' + str(area)
				if key not in house_status_chart['chartoptions_xaxis_categories']:
					house_status_chart['chartoptions_xaxis_categories'].append(key)
				if status == 0:
					house_status_chart['series_data_01'].append(temp_house_status_chart[garden_id][area][status])
				else:
					house_status_chart['series_data_02'].append(temp_house_status_chart[garden_id][area][status])


	data = {
		'customers_pin_chart': customers_pin_chart,
		'houses_bar_chart': houses_bar_chart,
		'houses_bar_stack_chart': houses_bar_stack_chart,
		'labels_check_in_chart': labels_check_in_chart,
		'customers_check_in_chart': customers_check_in_chart,
		'customers_stock_chart': customers_stock_chart,
		'house_status_chart': house_status_chart
	}


	return jsonify(data)
