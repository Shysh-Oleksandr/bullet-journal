export default interface IRoute {
    path: string;
    name: string;
    auth: boolean;
    component: any;
    props?: any;
}
