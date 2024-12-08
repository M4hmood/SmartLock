import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import Login from './components/login/index';
import Signup from './components/signup/index';
import ProtectedRoute from './protectedRoute';
import Home from './components/home/index';
import Users from './components/users/index';
import Cards from './components/cards/index';
import Settings from './components/settings/index';
import NotFound from './components/notFound/index';

const getAccessToken = () => {
    return localStorage.getItem("token");
}

const isAuthenticated = () => {
    return !!getAccessToken();
}

const Router = createBrowserRouter(
    [
        {
            path: '/login',
            element: <Login />,
            index: true
        },
        {
            path: '/signup',
            element: <Signup />,
            index: true
        },
        {
            element: <ProtectedRoute isAuthenticated={isAuthenticated()} />,
            children: [
            {
                path: '/', 
                element: <Home />
            },
            {
                path: '/home', 
                element: <Home />
            },
            {
                path: '/users', 
                element: <Users />
            },
            {
                path: '/cards',
                element: <Cards />
            },
            {
                path: '/settings',
                element: <Settings />
            },           
            ]
        },
        {
            path: '*',
            element: <NotFound />
        }
    ]
);

export default Router;