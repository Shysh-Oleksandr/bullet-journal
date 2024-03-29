import LoginPage from '../pages/Login';
import EditPage from '../pages/EditPage';
import HomePage from '../pages/HomePage';

interface IRoute {
    path: string;
    name: string;
    auth: boolean;
    component: any;
    props?: any;
}

const authRoutes: IRoute[] = [
    {
        path: '/login',
        name: 'Login',
        auth: false,
        component: LoginPage
    },
    {
        path: '/register',
        name: 'Register',
        auth: false,
        component: LoginPage
    }
];
const noteRoutes: IRoute[] = [
    {
        path: '/edit',
        name: 'Edit',
        auth: true,
        component: EditPage
    },
    {
        path: '/edit/:noteID',
        name: 'Edit',
        auth: true,
        component: EditPage
    }
];
const mainRoutes: IRoute[] = [
    {
        path: '/',
        name: 'Home',
        auth: true,
        component: HomePage
    }
];

const routes: IRoute[] = [...authRoutes, ...noteRoutes, ...mainRoutes];

export default routes;
