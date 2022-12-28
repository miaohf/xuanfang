from app import create_app, db
app=create_app()
app.app_context().push()
from sqlalchemy import func

from app.models import Roles, Users, Customers, Houses, Gardens, Areaitems, Houseitems, Buildings, Feefloats, Villages, Projects, Units, Floors

import math
from datetime import datetime

from selections_06_new import selections06_new


# customer_code', 'house_code', 'create_at', 'project_id
# ['8000975', '7002310', '2021/10/18 08:22', '1'],

for s in selections06_new:
    print(s)
    customer_code = s[0]
    house_code = s[1]
    create_at = s[2]
    project_id = s[3]

    customer = Customers.query.filter(Customers.project_id == project_id).filter(Customers.customer_code == customer_code).first()
    house = Houses.query.filter(Houses.temp_house_code == house_code).first()
    if customer and house.status == 0:
        house.last_update = datetime.strptime(create_at, '%Y/%m/%d %H:%M:%S')
        house.status = 1
        house.customer_id = customer.id
        house.project_id = project_id
    else:
        print('error')

db.session.commit()
