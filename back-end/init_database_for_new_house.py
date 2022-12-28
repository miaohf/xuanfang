from app import create_app, db
app=create_app()
app.app_context().push()
from sqlalchemy import func

from app.models import Roles, Users, Customers, Houses, Gardens, Areaitems, Houseitems, Buildings, Feefloats, Villages, Projects, Units, Floors

import math
from datetime import datetime

from houses_new import houses_new

def get_village(name):
    village = Villages.query.filter(Villages.name == name).first()
    if not village:
        village = Villages(
            name = name
            )
        db.session.add(village)
        db.session.flush()
    return village.id


def get_areaitem(area):
    if float(area) < 80:
        return 1
    elif float(area) < 100:
        return 2
    elif float(area) < 200:
        return 3
    else:
        return 4


def get_garden(name):
    garden = Gardens.query.filter(Gardens.name == name).first()  
    if not garden:
        garden = Gardens(name = name)
        db.session.add(garden)
        db.session.flush()
    return garden


def get_building(garden, building_name):
    building = Buildings.query.filter(Buildings.garden_id == garden.id).filter(Buildings.name == building_name).first()
    if not building:
        building = Buildings(
            garden_id = garden.id,
            name = building_name,
            deliver_type = garden.deliver_type)
        db.session.add(building)
        db.session.flush()
    return building


def get_unit(building, name, total_floors):
    unit = Units.query.filter(Units.building_id == building.id).filter(Units.name == name).first()
    if not unit:
        unit = Units(
            building_id = building.id,
            total_floors = total_floors,
            name = name
            )
        db.session.add(unit)
        db.session.commit()
    return unit


def get_floor(unit, floor_name):
    floor = Floors.query.filter(Floors.unit_id == unit.id).filter(Floors.name == floor_name).first()
    if not floor:
        floor = Floors(
            unit_id = unit.id,
            name = floor_name,
            )
        db.session.add(floor)
        db.session.commit()
    return floor


def get_houseitem(building, unit, number, area, total_floors):
    areaitem_id = get_areaitem(area)
    sequence = number[-1]
    houseitem = Houseitems.query\
        .filter(Houseitems.unit_id == unit.id)\
        .filter(Houseitems.sequence == sequence)\
        .filter(Houseitems.area == area)\
        .first()

    if not houseitem:
        houseitem = Houseitems(
            # building_id = building.id,
            areaitem_id = areaitem_id,
            unit_id = unit.id,
            area = area,
            sequence = sequence
            )
        db.session.add(houseitem)
        db.session.flush()
    return houseitem



# 导入房源
# ['house_code', 'temp_house_code', garden_name', 'building_name', 'unit_name', 'number', 'area', 'sub_area', 'floors'],
# ['', '7000001', '善和苑2期', '9', '1', '201', '123.26', '0.0', '18'],
for h in houses_new:
    print(h)
    # house_code = h[0]
    temp_house_code = h[1]
    garden_name = h[2]
    building_name = h[3]
    unit_name = h[4]
    number = h[5]
    area = float(h[6])
    sub_area = float(h[7])
    total_floors = h[8]
    floor_name = number[:-2]

    garden = get_garden(garden_name)
    building = get_building(garden, building_name)
    unit = get_unit(building, unit_name, total_floors)
    floor = get_floor(unit, floor_name)
    houseitem = get_houseitem(building, unit, number, area, total_floors)

    house = Houses(
        unit_id = unit.id,
        floor_id = floor.id,
        houseitem_id = houseitem.id,
        number = number,
        temp_house_code = temp_house_code,
        sub_area = sub_area,
        )
    db.session.add(house)
    db.session.flush()
    house.house_code = str(7000000 + house.id)

db.session.commit()

