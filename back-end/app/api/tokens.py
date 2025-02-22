from flask import jsonify, g
from app import db
from app.api import bp
from app.api.auth import basic_auth


@bp.route('/tokens', methods=['POST'])
@basic_auth.login_required
def get_token():
    token = g.current_user.get_jwt()
    if len(g.current_user.roles) > 0:
        roles = []
        for r in g.current_user.roles:
            roles.append(r.name)
    else:
        roles = []
    # 每次用户登录（即成功获取 JWT 后），更新 last_seen 时间
    g.current_user.ping()
    db.session.commit()
    data = {
    'token': token,
    'role': roles
    }
    return jsonify(data)
