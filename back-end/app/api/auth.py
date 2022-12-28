from flask import g
from flask_httpauth import HTTPBasicAuth, HTTPTokenAuth
from app import db
from app.models import Users
from app.api.errors import error_response

basic_auth = HTTPBasicAuth()
token_auth = HTTPTokenAuth()


@basic_auth.verify_password
def verify_password(username, password):
    '''用于检查用户提供的用户名和密码'''
    print(username, password)
    user = Users.query.filter_by(username=username).first()
    if user is None:
        return False
        # return error_response(50014)
    g.current_user = user
    return user.check_password(password)


@basic_auth.error_handler
def basic_auth_error():
    '''用于在认证失败的情况下返回错误响应'''
    return error_response(50008)


# @token_auth.verify_token
# def verify_token(token):
#     '''用于检查用户请求是否有token，并且token真实存在，还在有效期内'''
#     if token == 'null' or len(token) == 0:
#         print('Check token_auth ERROR')
#         return error_response(50014)
#     else:
#         # print('token: ', token)
#         g.current_user = Users.verify_jwt(token)
#         # 每次认证通过后（即将访问资源API），更新 last_seen 时间, 访问次数 +1
#         # print('g.current_user.login_counts:', g.current_user.login_counts)
#         g.current_user.ping()
#         # print('g.current_user.login_counts:', g.current_user.login_counts)


#         return g.current_user


@token_auth.verify_token
def verify_token(token):
    '''用于检查用户请求是否有token，并且token真实存在，还在有效期内'''
    g.current_user = Users.verify_jwt(token) if token else None
    if g.current_user:
        # 每次认证通过后（即将访问资源API），更新 last_seen 时间
        print(g.current_user)
        g.current_user.ping()
        db.session.commit()
    return g.current_user is not None




@token_auth.error_handler
def token_auth_error():
    '''用于在 Token Auth 认证失败的情况下返回错误响应'''
    print('token_auth_error')
    return error_response(50008)
