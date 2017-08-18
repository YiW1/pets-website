import petsHeader from '@/components/petsHeader'
import Login from '@/components/Login'
import SideMenu from '@/components/SideMenu'
import AllAdmin from '@/components/AllAdmin'
import ItemList from '@/components/ItemList'
import Evaluation from '@/components/Evaluation'
import TestResultByItem from '@/components/TestResultByItem'
import IndvTestResult from '@/components/IndvTestResult'
import StudentList from '@/components/StudentList'


  let routes = [
    {
      path: '/login',
      name: 'Login',
      components: {
        pheader: petsHeader,
        main: Login
      }
    },
    {
      path: '/home',
      name: 'home',
      components: {
        pheader: petsHeader,
        side: SideMenu
      }
    },
    {
      path: '/getadminlist',
      name: 'GetAdminList',
      components: {
        pheader: petsHeader,
        main: AllAdmin,
        side: SideMenu
      }
    },
    {
      path: '/getitemlist',
      name: 'GetItemList',
      components: {
        pheader: petsHeader,
        main: ItemList,
        side: SideMenu
      }
    },
    {
      path: '/getevaluation',
      name: 'GetEvaluation',
      components: {
        pheader: petsHeader,
        main: Evaluation,
        side: SideMenu
      }
    },
    {
      path: '/getstudentlist',
      name: 'GetStudentList',
      components: {
        pheader: petsHeader,
        main: StudentList,
        side: SideMenu
      }
    },
    {
      path: '/gettestresultbyitem',
      name: 'GetTestResultByItem',
      components: {
        pheader: petsHeader,
        main: TestResultByItem,
        side: SideMenu
      }
    },
    {
      path: '/getindvtestresult',
      name: 'GetIndvTestResult',
      components: {
        pheader: petsHeader,
        main: IndvTestResult,
        side: SideMenu
      }
    },
  ];

export default routes;
