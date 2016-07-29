"""
    Routes Configuration File

    Put Routing rules here
"""
from system.core.router import routes


routes['default_controller'] = 'Events'
routes['GET']['/projectmain'] = 'Events#projectmain'
routes['GET']['/projectmain/update'] = 'Events#update'

routes['GET']['/events/registration_page'] = 'Events#show_register_page'
routes['POST']['/events/register'] = 'Events#register'
routes['POST']['/login'] = 'Events#login'
routes['GET']['/success'] = 'Events#success'
routes['GET']['/logout'] = 'Events#logout'