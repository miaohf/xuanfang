from app import create_app, db
app=create_app()
app.app_context().push()
from sqlalchemy import func

from app.models import Roles, Users, Customers, Houses, Gardens, Areaitems, Houseitems, Buildings, Feefloats, Villages, Projects, Units, Floors

import math
from datetime import datetime

from houses import houses


projects = [
    ['大平台', 'DPT'],
    ['智果', 'ZG'],
    ['静脉', 'JM'],
    ['南北暑', 'NBS'],
    ['农房集聚', 'NFJJ']
]

for p in projects:
    project=Projects(
        name=p[0],
        code=p[1]
        )
    db.session.add(project)
db.session.commit()

r1=Roles(name='系统管理员', authority='administrator')
r2=Roles(name='签约操作员', authority='opertator')
r3=Roles(name='方案分析员', authority='analyser')
r4=Roles(name='方案录入员', authority='recorder')

db.session.add(r1)
db.session.add(r2)
db.session.add(r3)
db.session.add(r4)

# 拓展账号
u1=Users(username='miaohf', name='管理员', company = '嘉兴九色鹿软件科技有限公司')
u1.set_password('miaohf@coloredeer.com')
r1.users.append(u1)

db.session.commit()


# 结算层级差基础数据

records = [
    ['5','-2','2','7','6','-13'],
    ['6','-2','2','8','7','0','-15'],
    ['7','-6','-4','-2','0','2','4','6'],
    ['8','-7','-5','-3','-1','1','3','5','7'],
    ['9','-8','-6','-4','-2','0','2','4','6','8'],
    ['10','-9','-7','-5','-3','-1','1','3','5','7','9'],
    ['11','-10','-8','-6','-4','-2','0','2','4','6','8','10'],
    ['12','-11','-9','-7','-5','-3','-1','1','3','5','7','9','11'],
    ['13','-12','-10','-8','-6','-4','-2','0','2','4','6','8','10','12'],
    ['14','-13','-11','-9','-7','-5','-3','-1','1','3','5','7','9','11','13'],
    ['15','-14','-12','-10','-8','-6','-4','-2','0','2','4','6','8','10','12','14'],
    ['16','-15','-13','-11','-9','-7','-5','-3','-1','1','3','5','7','9','11','13','15'],
    ['17','-16','-14','-12','-10','-8','-6','-4','-2','0','2','4','6','8','10','12','14','16'],
    ['18','-17','-15','-13','-11','-9','-7','-5','-3','-1','1','3','5','7','9','11','13','15','17'],
    ['19','-18','-16','-14','-12','-10','-8','-6','-4','-2','0','2','4','6','8','10','12','14','16','18'],
    ['20','-19','-17','-15','-13','-11','-9','-7','-5','-3','-1','1','3','5','7','9','11','13','15','17','19'],
    ['21','-20','-18','-16','-14','-12','-10','-8','-6','-4','-2','0','2','4','6','8','10','12','14','16','18','20'],
    ['22','-21','-19','-17','-15','-13','-11','-9','-7','-5','-3','-1','1','3','5','7','9','11','13','15','17','19','21'],
    ['23','-22','-20','-18','-16','-14','-12','-10','-8','-6','-4','-2','0','2','4','6','8','10','12','14','16','18','20','22'],
    ['24','-23','-21','-19','-17','-15','-13','-11','-9','-7','-5','-3','-1','1','3','5','7','9','11','13','15','17','19','21','23'],
    ['25','-24','-22','-20','-18','-16','-14','-12','-10','-8','-6','-4','-2','0','2','4','6','8','10','12','14','16','18','20','22','24'],
    ['26','-26','-24','-22','-20','-18','-16','-14','-12','-10','-8','-6','-4','-2','0','2','4','6','8','10','12','14','16','18','20','22','24'],
    ['27','-28','-26','-24','-22','-20','-18','-16','-14','-12','-10','-8','-6','-4','-2','0','2','4','6','8','10','12','14','16','18','20','22','24'],
]
for r in records:
    print(r)
    for i in r:
        print(i, r.index(i))
        if r.index(i) != 0:
            feefloat = Feefloats(
                floors = r[0],
                floor = r.index(i),
                value = i
                )
            db.session.add(feefloat)
db.session.commit()


def get_village(name):
    village = Villages.query.filter(Villages.name == name).first()
    if not village:
        village = Villages(
            name = name
            )
        db.session.add(village)
        db.session.flush()
    return village.id



# 初始化房源户型
areaitems = [
    ['小套', 'small', 80],
    ['中套', 'medium', 100],
    ['大套', 'large', 200 ],
    ['特大套','x-large', 999]
]

for ai in areaitems:
    areaitem = Areaitems(name = ai[0], keyname = ai[1], max_area = ai[2])
    db.session.add(areaitem)
db.session.commit()


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
# ['house_code', 'garden_name', 'building_name', 'unit_name', 'number', 'area', 'sub_area', 'floors'],
# ['7000001', '善智苑二期', '1', '1', '201', '108.0', '0.0', '23'],
for h in houses:
    print(h)
    house_code = h[0]
    garden_name = h[1]
    building_name = h[2]
    unit_name = h[3]
    number = h[4]
    area = float(h[5])
    sub_area = float(h[6])
    total_floors = h[7]
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
        house_code = house_code,
        sub_area = sub_area,
        )
    db.session.add(house)

db.session.commit()

