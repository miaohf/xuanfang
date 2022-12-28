from app import create_app, db
app=create_app()
app.app_context().push()
from sqlalchemy import func

from app.models import Roles, Users, Customers, Houses, Gardens, Areaitems, Houseitems, Buildings, Feefloats, Villages, Projects, Units, Floors

import math
from datetime import datetime

from customers_01 import customers01
from customers_02 import customers02
from customers_03 import customers03
from customers_04 import customers04
from customers_05 import customers05
from customers_06 import customers06

from selections_01 import selections01
from selections_02 import selections02
from selections_03 import selections03
from selections_04 import selections04
from selections_05 import selections05
from selections_06 import selections06

def get_village(name):
    village = Villages.query.filter(Villages.name == name).first()
    if not village:
        village = Villages(
            name = name
            )
        db.session.add(village)
        db.session.flush()
    return village.id


# customer_code   name    cardid  sub_name    sub_cardid  admission_sequence  lottery_sequence    population  population_aa   population_ao   population_na   population_no   jianzhu_area    population_area myarea  myarea_remain   phone   address village_name    note    project_id
# 8000001 费金兴 330421196303273012              57  3   3   0   0   0   255.58  120.0   255.58  -49.42  13567332390 费家浜1号   里泽村     1

customer_list = [ customers01, customers02, customers03, customers04, customers05, customers06 ]

for customers in customer_list:
    for c in customers:
        print(c)
        customer = Customers(
            customer_code = c[0],
            name = c[1],
            cardid = c[2],
            sub_name = c[3],
            sub_cardid = c[4],
            admission_sequence = c[5],
            lottery_sequence = c[6],
            population = c[7],
            population_aa = c[8],
            population_na = c[9],
            population_ao = c[10],
            population_no = c[11],

            jianzhu_area = c[12],       #核定原合法户型 建筑面积
            population_area = c[13],    #安置标准内面积 标准面积

            myarea = c[14],
            myarea_remain =  c[15],
            phone = c[16],
            address = c[17],
            village_id = get_village(c[18]),

            note = c[19],
            project_id = c[20],
            
        )

        db.session.add(customer)
db.session.commit()


# customer_code', 'house_code', 'create_at', 'project_id
# ['8000975', '7002310', '2021/10/18 08:22', '1'],
selections_list = [ selections01, selections02, selections03, selections04, selections05, selections06 ]

for selections in selections_list:
    for s in selections:
        print(s)
        customer_code = s[0]
        house_code = s[1]
        create_at = s[2]
        project_id = s[3]

        customer = Customers.query.filter(Customers.project_id == project_id).filter(Customers.customer_code == customer_code).first()
        house = Houses.query.filter(Houses.house_code == house_code).first()
        if customer and house.status == 0:
            house.last_update = datetime.strptime(create_at, '%Y/%m/%d %H:%M:%S')
            house.status = 1
            house.customer_id = customer.id
            house.project_id = project_id
        else:
            print('error')

db.session.commit()
