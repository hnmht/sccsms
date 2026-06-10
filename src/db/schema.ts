import { SQLBatchTuple } from "react-native-quick-sqlite";

export const createTableSQL: SQLBatchTuple[] = [
    // appinfo table
    [`CREATE TABLE IF NOT EXISTS 
    appinfo(appname TEXT NOT NULL UNIQUE,appversion TEXT,dbid TEXT,serveraddr TEXT,globalpath TEXT,token TEXT,serverinfo JSON,isoffline INTEGER,userinfo JSON,isfinish INTEGER  DEFAULT 0,
    PRIMARY KEY('appname'))`],
    // lang table
    [`CREATE TABLE IF NOT EXISTS 
    lang(appname TEXT NOT NULL UNIQUE,languagetag TEXT, 
    PRIMARY KEY('appname'));`],
    // tsinfo table
    [`CREATE TABLE IF NOT EXISTS tsinfo(dataname TEXT NOT NULL UNIQUE,ts TEXT,PRIMARY KEY('dataname'));`],
    // department table
    [`CREATE TABLE IF NOT EXISTS department(id INTEGER NOT NULL UNIQUE,code TEXT,name TEXT,ts TEXT,value JSON,PRIMARY KEY('id'))`],
    [`CREATE TABLE IF NOT EXISTS department_recent(autoid INTEGER,id INTEGER NOT NULL UNIQUE,code TEXT,name TEXT,ts TEXT,value JSON,PRIMARY KEY('autoid' AUTOINCREMENT))`],
    // epa table
    [`CREATE TABLE IF NOT EXISTS epa(id INTEGER NOT NULL UNIQUE,code TEXT, name TEXT,epcid INTEGER,resulttypeid INTEGER,value JSON,PRIMARY KEY('id'))`],
    [`CREATE TABLE IF NOT EXISTS epa_recent(autoid INTEGER,id INTEGER NOT NULL UNIQUE,code TEXT, name TEXT,epcid INTEGER,resulttypeid INTEGER,value JSON,PRIMARY KEY('autoid' AUTOINCREMENT))`],
    // epc table
    [`CREATE TABLE IF NOT EXISTS epc(id INTEGER NOT NULL UNIQUE,name TEXT,ts TEXT,status INTEGER,value JSON,PRIMARY KEY('id'))`],
    [`CREATE TABLE IF NOT EXISTS epc_recent(autoid INTEGER,id INTEGER NOT NULL UNIQUE,name TEXT,ts TEXT,status INTEGER,value JSON,PRIMARY KEY('autoid' AUTOINCREMENT))`],
    // ept table
    [`CREATE TABLE IF NOT EXISTS ept(id INTEGER NOT NULL UNIQUE,code TEXT,name TEXT,ts TEXT,status INTEGER,value JSON,PRIMARY KEY('id'))`],
    [`CREATE TABLE IF NOT EXISTS ept_recent(autoid INTEGER,id INTEGER NOT NULL UNIQUE,code TEXT,name TEXT,ts TEXT,status INTEGER,value JSON,PRIMARY KEY('autoid' AUTOINCREMENT))`],
    // person table
    [`CREATE TABLE IF NOT EXISTS person(id INTEGER NOT NULL UNIQUE,code TEXT,name TEXT,deptid INTEGER,positionid  INTEGER,ts TEXT,value JSON,PRIMARY KEY('id'))`],
    [`CREATE TABLE IF NOT EXISTS person_recent(autoid INTEGER,id INTEGER NOT NULL UNIQUE,code TEXT,name TEXT,deptid INTEGER,positionid  INTEGER,ts TEXT,value JSON,PRIMARY KEY('autoid' AUTOINCREMENT))`],
    // csa table
    [`CREATE TABLE IF NOT EXISTS csa(id INTEGER NOT NULL UNIQUE,code TEXT,name TEXT,cscid INTEGER,ts TEXT,status INTEGER,value JSON,PRIMARY KEY('id'))`],
    [`CREATE TABLE IF NOT EXISTS csa_recent(autoid INTEGER,id INTEGER NOT NULL UNIQUE,code TEXT,name TEXT,cscid INTEGER,ts TEXT,status INTEGER,value JSON,PRIMARY KEY('autoid' AUTOINCREMENT))`],
    // csc table
    [`CREATE TABLE IF NOT EXISTS csc(id INTEGER NOT NULL UNIQUE,name TEXT,ts TEXT,status INTEGER,value JSON,PRIMARY KEY('id'))`],
    [`CREATE TABLE IF NOT EXISTS csc_recent(autoid INTEGER,id INTEGER NOT NULL UNIQUE,name TEXT,ts TEXT,status INTEGER,value JSON,PRIMARY KEY('autoid' AUTOINCREMENT))`],
    // cso table
    [`CREATE TABLE IF NOT EXISTS cso(id INTEGER NOT NULL UNIQUE,code TEXT,name TEXT, ts TEXT, value JSON,PRIMARY KEY('id'))`],
    // udc table
    [`CREATE TABLE IF NOT EXISTS udc(id INTEGER NOT NULL UNIQUE,name TEXT,ts TEXT,status INTEGER,value JSON,PRIMARY KEY('id'))`],
    [`CREATE TABLE IF NOT EXISTS udc_recent(autoid INTEGER,id INTEGER NOT NULL UNIQUE,name TEXT,ts TEXT,status INTEGER,value JSON,PRIMARY KEY('autoid' AUTOINCREMENT))`],
    // risk level
    [`CREATE TABLE IF NOT EXISTS risklevel(id INTEGER NOT NULL UNIQUE,name TEXT,ts TEXT,status INTEGER,value JSON,PRIMARY KEY('id'))`],
    [`CREATE TABLE IF NOT EXISTS risklevel_recent(autoid INTEGER,id INTEGER NOT NULL UNIQUE,name TEXT,ts TEXT,status INTEGER,value JSON,PRIMARY KEY('autoid' AUTOINCREMENT))`],
    // dc table
    [`CREATE TABLE IF NOT EXISTS dc(id INTEGER NOT NULL UNIQUE,name TEXT,ts TEXT,status INTEGER,value JSON,PRIMARY KEY('id'))`],
    [`CREATE TABLE IF NOT EXISTS dc_recent(autoid INTEGER,id INTEGER NOT NULL UNIQUE,name TEXT,ts TEXT,status INTEGER,value JSON,PRIMARY KEY('autoid' AUTOINCREMENT))`],
    // position table
    [`CREATE TABLE IF NOT EXISTS position(id INTEGER NOT NULL UNIQUE,name TEXT,ts TEXT,status INTEGER,value JSON,PRIMARY KEY('id'))`],
    [`CREATE TABLE IF NOT EXISTS position_recent(autoid INTEGER,id INTEGER NOT NULL UNIQUE,name TEXT,ts TEXT,status INTEGER,value JSON,PRIMARY KEY('autoid' AUTOINCREMENT))`],
    // tc table
    [`CREATE TABLE IF NOT EXISTS tc(id INTEGER NOT NULL UNIQUE,name TEXT,ts TEXT,status INTEGER,value JSON,PRIMARY KEY('id'))`],
    [`CREATE TABLE IF NOT EXISTS tc_recent(autoid INTEGER,id INTEGER NOT NULL UNIQUE,name TEXT,ts TEXT,status INTEGER,value JSON,PRIMARY KEY('autoid' AUTOINCREMENT))`],
    // ppe table
    [`CREATE TABLE IF NOT EXISTS ppe(id INTEGER NOT NULL UNIQUE,name TEXT,ts TEXT,status INTEGER,value JSON,PRIMARY KEY('id'))`],
    [`CREATE TABLE IF NOT EXISTS ppe_recent(autoid INTEGER,id INTEGER NOT NULL UNIQUE,name TEXT,ts TEXT,status INTEGER,value JSON,PRIMARY KEY('autoid' AUTOINCREMENT))`],
    // uda table
    [`CREATE TABLE IF NOT EXISTS uda(id INTEGER NOT NULL UNIQUE,udcid INTEGER,ts TEXT,status INTEGER,value JSON,PRIMARY KEY('id'))`],
    [`CREATE TABLE IF NOT EXISTS uda_recent(autoid INTEGER,id INTEGER NOT NULL UNIQUE,udcid INTEGER,ts TEXT,status INTEGER,value JSON,PRIMARY KEY('autoid' AUTOINCREMENT))`],
    // workorderref table
    [`CREATE TABLE IF NOT EXISTS workorderref(id INTEGER NOT NULL UNIQUE,hid INTEGER,billdate TEXT,billnumber TEXT,status INTEGER,ts TEXT,value JSON,PRIMARY KEY('id'))`],
    // executionorderref table
    [`CREATE TABLE IF NOT EXISTS executionorderref(id INTEGER NOT NULL UNIQUE,hid INTEGER,billdate TEXT,billnumber TEXT,status INTEGER,ts TEXT,value JSON,PRIMARY KEY('id'))`],
    // workorder table
    [`CREATE TABLE IF NOT EXISTS workorder(id INTEGER,creatorid INTEGER,value JSON,PRIMARY KEY('id' AUTOINCREMENT))`],
    // executionorder table
    [`CREATE TABLE IF NOT EXISTS executionorder(id INTEGER,creatorid INTEGER,value JSON,PRIMARY KEY('id' AUTOINCREMENT))`],
    // issueresolutionform table
    [`CREATE TABLE IF NOT EXISTS issueresolutionform(id INTEGER,creatorid INTEGER,value JSON,PRIMARY KEY('id' AUTOINCREMENT))`]
];

export const dropAllTableSQL: SQLBatchTuple[] = [
    ['drop table if exists appinfo'],
    ['drop table if exists lang'],
    ['drop table if exists tsinfo'],
    ['drop table if exists department'],
    ['drop table if exists department_recent'],
    ['drop table if exists epa'],
    ['drop table if exists epa_recent'],
    ['drop table if exists epc'],
    ['drop table if exists epc_recent'],
    ['drop table if exists ept'],
    ['drop table if exists ept_recent'],
    ['drop table if exists person'],
    ['drop table if exists person_recent'],
    ['drop table if exists csa'],
    ['drop table if exists csa_recent'],
    ['drop table if exists csc'],
    ['drop table if exists csc_recent'],
    ['drop table if exists cso'],
    ['drop table if exists udc'],
    ['drop table if exists udc_recent'],
    ['drop table if exists risklevel'],
    ['drop table if exists risklevel_recent'],
    ['drop table if exists dc'],
    ['drop table if exists dc_recent'],
    ['drop table if exists position'],
    ['drop table if exists position_recent'],
    ['drop table if exists tc'],
    ['drop table if exists tc_recent'],
    ['drop table if exists ppe'],
    ['drop table if exists ppe_recent'],
    ['drop table if exists uda'],
    ['drop table if exists uda_recent'],
    ['drop table if exists workorderref'],
    ['drop table if exists executionorderref'],
    ['drop table if exists workorder'],
    ['drop table if exists executionorder'],
    ['drop table if exists issueresolutionform'],
];