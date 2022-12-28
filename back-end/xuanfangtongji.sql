select count(*) from customers where lottery_sequence;
select count(DISTINCT customer_id) from contracts;
select count(*) from houses;

select count(*), g.name from houses h, houseitems hi, buildings b, gardens g
where h.houseitem_id = hi.id
and hi.building_id = b.id
and b.garden_id = g.id
group by g.name;

select  g.name as gname, ai.name, h.status, count(*) as count from houses h, houseitems hi, buildings b, gardens g, areaitems ai
where h.houseitem_id = hi.id
and hi.building_id = b.id
and b.garden_id = g.id
and hi.areaitem_id = ai.id
and h.status = 1
and h.last_update <= date('now')

group by g.name, ai.name, h.status
ORDER BY g.name, ai.name, h.status



select lottery_sequence as '抽签顺序号', name as '姓名', myarea as '可选面积' from customers where id not in (select customer_id from contracts) ORDER BY  lottery_sequence