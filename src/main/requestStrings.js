export const kslpStr = `select concat('2022_', T_CODE) C_I, KIND1 DS from Z.ZI_DIAG_IB_LIST_ALL where kind in ('клинический заключительный (эпикриз)', 'клинический заключительный')`;

const excel = `select 
oms.fio, oms.patient,oms.id, oms.c_i, oms.cod, oms.dds, oms.dr, oms.w, oms.s_pol, nvl(oms.sn_pol, '123456789012345') sn_pol, oms.c_t, oms.usl_ok, oms.in_date, oms.out_date, oms.org as PODR_NAME, oms.org_code as PODR, nvl(oms.final_code, '0') final_code, oms.srv_code, oms.srv_name, oms.usl_date, oms.age from (
  select
  oms.fio,
  oms.patient,
  oms.id,
  oms.c_i,
  oms.cod,
  oms.dds,
  oms.dr,
  oms.w,
  oms.s_pol,
  oms.sn_pol,
  oms.c_t,
  oms.usl_ok,
  oms.in_date,
  oms.out_date,
  oms.org,
  oms.org_code,
  oms.final_code,
  nvl(oms.srv_code, null) as srv_code,
  nvl(oms.srv_name, null) as srv_name,
  oms.usl_date,
  oms.age
  from
  (SELECT DISTINCT
  st.fio,
  vst.patient,
  vst.id,
  vst.c_i,
  vst.cod,
  vst.dds,
  vst.dr,
  vst.w,
  vst.s_pol,
  vst.sn_pol,
  vst.c_t,
  vst.usl_ok,
  vst.in_date,
  vst.out_date,
  vst.org,
  vst.org_code,
  vst.final_code,
  nvl(e.code, e.code1) srv_code,
  nvl(e.fullname,e.name) srv_name,
  trunc(r.r_date) usl_date,
  vst.age
  from st.ksg_list_v vst
  inner join t_med_chrts ch on ch.id = vst.id
  inner join st.oms_list_v st on st.patient = vst.patient
  left join od_vorders r on r.chart_id = ch.id
  left join od_vec_srvs e on r.r_service_id = e.id
  WHERE 
  vst.cod not like '200%'  and vst.channel not like 'Городская скорая помощь' and
  r.status = 0 and
  r.r_status = 1 and
  e.stype in ('ST_DIAG', 'ST_OPER', 'ST_PROC')
  ORDER BY c_i) oms,
  queries qu
  where lower(qu.title) = 'список оказанных услуг по иб' and trunc(oms.usl_date) between to_date('01.12.2020','dd.mm.yyyy') and to_date('31.12.2022','dd.mm.yyyy') 
  union all
  select
  oms.fio,
  oms.patient,
  oms.id,
  oms.c_i,
  oms.cod,
  oms.dds,
  oms.dr,
  oms.w,
  oms.s_pol,
  oms.sn_pol,
  oms.c_t,
  oms.usl_ok,
  oms.in_date,
  oms.out_date,
  oms.org,
  oms.org_code,
  oms.final_code,
  nvl(oms.srv_code, null) as srv_code,
  nvl(oms.srv_name, null) as srv_name,
  oms.usl_date,
  oms.age
  from
  (SELECT DISTINCT
  st.fio,
  vst.patient,
  vst.id,
  vst.c_i,
  nvl(vst.cod, '69090') as cod,
  vst.dds,
  vst.dr,
  vst.w,
  vst.s_pol,
  vst.sn_pol,
  vst.c_t,
  vst.usl_ok,
  vst.in_date,
  vst.out_date,
  vst.org,
  vst.org_code,
  vst.final_code,
  nvl(e.code1, e.code) srv_code,
  nvl(e.fullname,e.name) srv_name,
  trunc(r.r_date) usl_date,
  vst.age
  from st.ksg_list_v vst
  inner join t_med_chrts ch on ch.id = vst.id
  inner join st.oms_list_v st on st.patient = vst.patient
  left join od_vorders r on r.chart_id = ch.id
  left join od_vec_srvs e on r.r_service_id = e.id
  WHERE 
  vst.cod is null and vst.channel not like 'Городская скорая помощь'  and
  r.status = 0 and
  r.r_status = 1 and
  e.stype in ('ST_DIAG', 'ST_OPER', 'ST_PROC')
  ORDER BY c_i) oms,
  queries qu
  where lower(qu.title) = 'список оказанных услуг по иб' and trunc(oms.usl_date) between to_date('01.12.2020','dd.mm.yyyy') and to_date('31.12.2022','dd.mm.yyyy') 
  union all
  select
  oms.fio,
  oms.patient,
  oms.id,
  oms.c_i,
  oms.cod,
  oms.dds,
  oms.dr,
  oms.w,
  oms.s_pol,
  oms.sn_pol,
  oms.c_t,
  oms.usl_ok,
  oms.in_date,
  oms.out_date,
  oms.org,
  oms.org_code,
  oms.final_code,
  nvl(oms.srv_code, null) as srv_code,
  nvl(oms.srv_name, null) as srv_name,
  oms.usl_date,
  oms.age
  from
  (SELECT DISTINCT
  st.fio,
  vst.patient,
  vst.id,
  vst.c_i,
  vst.cod,
  vst.dds,
  vst.dr,
  vst.w,
  vst.s_pol,
  vst.sn_pol,
  vst.c_t,
  vst.usl_ok,
  vst.in_date,
  vst.out_date,
  vst.org,
  vst.org_code,
  vst.final_code,
  nvl(e.code1, e.code) srv_code,
  nvl(e.fullname,e.name) srv_name,
  trunc(r.r_date) usl_date,
  vst.age
  from st.ksg_list_v vst
  inner join t_med_chrts ch on ch.id = vst.id
  inner join st.oms_list_v st on st.patient = vst.patient
  left join od_vorders r on r.chart_id = ch.id
  left join od_vec_srvs e on r.r_service_id = e.id
  WHERE 
  vst.cod not like '200%'  and vst.channel not like 'Городская скорая помощь' and
  r.status = 0 and
  r.r_status = 1 and
  e.stype in ('ST_DIAG', 'ST_OPER', 'ST_PROC')
  ORDER BY c_i) oms,
  queries qu
  where lower(qu.title) = 'список оказанных услуг по иб' and trunc(oms.usl_date) between to_date('01.01.2021','dd.mm.yyyy') and to_date('30.12.2022','dd.mm.yyyy')
union all
select
st.fio,
list.patient,
list.id,
list.c_i,
list.cod,
list.dds,
list.dr,
list.w,
list.s_pol,
list.sn_pol,
list.c_t,
list.usl_ok,
list.in_date,
list.out_date,
list.org,
list.org_code,
list.final_code,
list.cod srv_code,
null srv_name,
null usl_date,
list.age
from st.ksg_list_v list
inner join st.oms_list_v st on st.patient = list.patient
where list.cod like '200%' and list.cod not in ('200530', '200525', '200409', '200510' ) and  list.channel not like 'Городская скорая помощь'
union all
select
st.fio,
list.patient,
list.id,
list.c_i,
list.cod,
list.dds,
list.dr,
list.w,
list.s_pol,
list.sn_pol,
list.c_t,
list.usl_ok,
list.in_date,
list.out_date,
list.org,
list.org_code,
list.final_code,
list.cod srv_code,
null srv_name,
null usl_date,
list.age
from st.ksg_list_v list
inner join st.oms_list_v st on st.patient = list.patient
where list.cod in ('200530', '200525', '200409', '200510')
) oms
`;

const doc = `select distinct doc.* from oms_pat_doc doc inner join oms_pat_pol pol on doc.patient = pol.patient where doc.patient  not in ('33356', '89912', '63463')`;
const pol = `select distinct pol.* from oms_pat_pol pol where sn_pol is not null and patient not in ('33356', '89912', '63463')`;
const adr = `select distinct adr.* from oms_pat_adr adr inner join oms_pat_pol pol on adr.patient = pol.patient`;
const pat = `select distinct pat.* from oms_pat pat inner join oms_pat_pol pol on pat.patient = pol.patient `;
const history = `select distinct mk.fio, mk.patient, mk.c_i, mk.t_ci, mk.mb_stat, decode(tal.talon_num, null, '', concat(mk.patient, mk.c_i)) ap_id, mk.h_typ, mk.src, mk.ord, mk.ishod, mk.rslt, mk.prog, mk.travma, mk.ds_p, mk.ds, mk.ds_s, mk.ds_o, smp.dord_n,
decode(tal.talon_num, null, '', concat(mk.patient, mk.c_i)) vmpap_id
from bra.oms_pat_mk mk
inner join oms_pat_pol pol on mk.patient = pol.patient
left join bra.smp_num smp on mk.med_id = smp.med_id 
left join a.t_smh_plans tal on smp.med_id = tal.t_med_chrt_id`;
const amb = `select srv.* from st.oms_pat_srv_1 srv
where exists (select 1 from oms_pat_pol pol where pol.patient = srv.patient)`;
const move = `select distinct move.fio_pat, move.patient, move.c_i, move.org_type, move.org_pat, move.cod_u, move.fio_sot, to_date(move.d_b, 'dd.mm.yy') d_b, to_char(move.d_b, 'HH24:MI') d_time, move.kind, move.dds, move.cod, move.prog, move.tip, move.d_type, move.mcod, move.code, move.result, move.h_pays, move.h_date 
from oms_pat_move move
inner join st.ksg_list list on list.patient = move.patient
where list.channel like 'Городская скорая помощь' and move.kind like 'ПОЛОЖЕН' and move.c_i not in ('2026_1917', '2026_1942', '2026_1905', '2026_1494', '2026_2513', '2026_1978', '2026_2558', '2026_2748', '2026_1905', '2026_2218', '2026_6184', '2026_7517', '2026_7769', '2026_7967', '2026_8795', '2026_8346', '2026_8653', '2026_8864', '2026_9052', '2026_8080', '2026_8731', '2026_8658', '2026_8627', '2026_8345')
union all
select distinct move.fio_pat, move.patient, move.c_i, move.org_type, move.org_pat, move.cod_u, move.fio_sot, to_date(move.d_b, 'dd.mm.yy') d_b, to_char(move.d_b, 'HH24:MI') d_time, move.kind, move.dds, move.cod, move.prog, move.tip, move.d_type, move.mcod, move.code, move.result, move.h_pays, move.h_date 
from oms_pat_move move
inner join st.ksg_list list on list.patient = move.patient
where list.channel like 'Городская скорая помощь' and move.kind like 'ПЕРЕВЕДЕН' and move.c_i not in ('2026_1917', '2026_1942', '2026_1905', '2026_1494', '2026_2513', '2026_1978', '2026_2558', '2026_2748', '2026_1905', '2026_2218', '2026_6184', '2026_7517', '2026_7769', '2026_7967', '2026_8795', '2026_8346', '2026_8653', '2026_8864', '2026_9052', '2026_8080', '2026_8731', '2026_8658', '2026_8627', '2026_8345')
union all
select distinct move.fio_pat, move.patient, move.c_i, move.org_type, move.org_pat, move.cod_u, move.fio_sot, to_date(move.d_b, 'dd.mm.yy') d_b, to_char(move.d_b, 'HH24:MI') d_time, move.kind, move.dds, move.cod, move.prog, move.tip, move.d_type, move.mcod, move.code, move.result, move.h_pays, move.h_date 
from oms_pat_move move
inner join st.ksg_list list on list.patient = move.patient
where list.channel like 'Городская скорая помощь' and move.kind like 'ВЫПИСАН' and move.c_i not in ('2026_1917', '2026_1942', '2026_1905', '2026_1494', '2026_2513', '2026_1978', '2026_2558', '2026_2748', '2026_1905', '2026_2218', '2026_6184', '2026_7517', '2026_7769', '2026_7967', '2026_8795', '2026_8346', '2026_8653', '2026_8864', '2026_9052', '2026_8080', '2026_8731', '2026_8658', '2026_8627', '2026_8345')
order by c_i, d_b, d_time`;
const talons = `select CONCAT(move.patient, move.c_i) AP_ID,
move.patient,
'4' AP_TYPE, 
talons.talon_num N_NAP,
list.in_date D_NAP,
move.dds DS_NAP,
'0371001' ORGAN
from voms_st move
inner join st.ksg_list list on list.patient = move.patient
left join smp_num smp on move.med_id = smp.med_id
left join a.t_smh_plans talons on talons.t_med_chrt_id = smp.med_id
where list.channel like 'Городская скорая помощь'`;

export const fullStr = 'select c_i from voms_st'
export const emergencyStr = `select * from st.ksg_list_v where channel like 'Городская скорая помощь'`

export const listOfOmsRequests = [
  { name: 'PO', req: pol },
  { name: 'AD', req: adr },
  { name: 'PA', req: pat },
  { name: 'DU', req: doc },
  { name: 'MU', req: amb },
  { name: 'MB', req: history },
  { name: 'AP', req: talons },
  { name: 'DV', req: move}
];

const xml = `select 
st.fio,
st.patient,
st.id,
st.c_i,
st.dds,
st.dr,
st.w,
st.s_pol,
st.sn_pol,
decode(length(st.sn_pol), 10 , '1',
                          16, '3',
                          9, '2',
                          '3') vpolis,
st.c_t,
st.usl_ok,
st.in_date,
st.out_date,
st.org podr_name,
st.org_code podr,
st.final_code,
st.age,
st.f_mes_code,
st.f_mes_name,
st.f_ksg_num,
st.f_c_kslp,
st.f_mes_summ,
st.f_kz,
st.f_cdiff,
st.f_cspec,
decode(st.f_cpriv, '1.32', '0.32', st.f_cpriv) f_cpriv,
st.f_zp,
decode(st.f_base, '44102.9', '47678.6', st.f_base) f_base,
decode(st.F_CR_MKB_CODE2, null, '', st.F_CR_MKB_CODE2) F_CR_MKB_CODE2,
decode(st.F_CR_PARAM_CODE, 'pbt', 'gibp30', st.F_CR_PARAM_CODE) F_CR_PARAM_CODE,
st.f_c_duration_case,
st.f_cr_service_code,
tal.talon_num tal_num,
tal.talon_date tal_d,
st.json_data
from bra.interin_ksg st
left join  a.t_smh_plans tal on tal.t_med_chrt_id = st.id
`;

export const vmpReq = `select 
v.patient,
v.id, 
v.fio,
v.c_i,
v.dds ds1,
v.dr,
v.w,
v.s_pol,
nvl(v.sn_pol, '1234567890123456') sn_pol,
decode(length(v.sn_pol), 10 , '1',
                          16, '3',
                          9, '2',
                          '3') vpolis,
v.c_t,
v.usl_ok,
v.vpolis,
decode(vmp.group_code, 5 , '93',
                          6, '94',
                          7, '95',
                          10, '98',
                          11, '99',
                          vmp.group_code) group_code,
vmp.profile_code, 
vmp.profile_name,
vmp.vid_code vid_hmp,
vmp.vid_name,
vmp.method_code metod_hmp,
vmp.method_name model_name,
v.in_date,
v.out_date,
v.org podr_name,
v.org_code podr,
v.final_code,
ord.shortname srv_org,
v.age,
tal.talon_num tal_num,
tal.talon_date tal_d,
f.json_data,
ord.code
from st.ksg_list v 
left join ( select parent_id, json_data from wi.xs$fd where doc_type='FD.PROTOCOL_IMPLANTS' and status <99) f on v.id = f.parent_id
left join a.t_smh_plans tal on tal.t_med_chrt_id = v.id
inner join st.vmp_int vmp on v.id = vmp.t_med_chrt_id
left join (select r.chart_id, e.code, s.shortname from mi_orders r
inner join od_vec_srvs e on e.id = r.r_service_id
inner join s_str_orgs s on r.s_str_org_id = s.s_str_org_id
where e.code1 in  ('16.12.027', '16.12.021', '16.12.027.7', '16.10.159', '16.12.027.6', '16.10.125.1', '16.31.589', '16.12.027.8', '16.12.027.9', '16.12.027.10', '16.12.027.11', '16.12.027.12', '16.12.027.1', '16.31.529', '16.12.134', '16.12.027.04', '16.10.139', '16.12.027.03', '16.12.027.05', '16.10.014', '16.10.140', '16.10.015', '16.12.025.6','16.10.020?', '16.10.031', '16.12.301.2', '16.12.301.1', '16.10.163', '16.10.163.1', '16.10.204', '16.10.243.2', '16.10.243.1', '16.10.017', '16.31.710', '16.31.703', '16.10.243.3', '16.31.702.2', '16.31.702.3', '16.31.702.4', '16.31.707', '16.31.707.1', '16.31.708.1', '16.31.709', '16.31.709.1', '16.31.709.2', '16.31.710', '16.10.128', '16.10.129', '16.10.118', '16.10.137', '16.10.115', '16.10.134', '16.10.170', '16.10.113', '16.10.132', '16.10.114', '16.10.133', '16.10.145', '16.10.100', '16.12.027.031', '16.12.027.041', '16.12.027.051', '16.31.704.1')
) ord on v.id = ord.chart_id  
where v.channel not like 'Город%' or v.c_i in ('2026_4171', '2026_6586', '2026_2833', '2026_3319', '2026_3175', '2026_747', '2026_2513', '2026_1114', '2026_3539', '2026_811', '2026_6122', '2026_5883', '2026_7824')
`
export const ksg = `select 
st.fio,
st.patient,
st.id,
st.c_i,
st.dds,
st.dr,
st.w,
st.s_pol,
nvl(st.sn_pol, '1234567890123456') sn_pol,
st.c_t,
st.usl_ok,
st.in_date,
st.out_date,
st.org podr_name,
st.org_code podr,
st.final_code,
st.age,
st.f_mes_code,
st.f_mes_name,
st.f_ksg_num,
st.f_cr_service_code,
null description,
null srv_org,
st.f_c_kslp,
to_number(REPLACE(st.f_mes_summ, '.', ',')) f_mes_summ,
st.f_kz,
st.f_cdiff,
st.f_cspec,
st.f_cpriv,
st.f_zp,
st.f_base,
decode(st.F_CR_MKB_CODE2, null, '', st.F_CR_MKB_CODE2) F_CR_MKB_CODE2,
decode(st.F_CR_PARAM_CODE, 'pbt', 'gibp30', st.F_CR_PARAM_CODE) F_CR_PARAM_CODE,
st.f_c_duration_case
from bra.interin_ksg st where st.f_cr_service_code is null
union all
select 
distinct
st.fio,
st.patient,
st.id,
st.c_i,
st.dds,
st.dr,
st.w,
st.s_pol,
nvl(st.sn_pol, '1234567890123456') sn_pol,
st.c_t,
st.usl_ok,
st.in_date,
st.out_date,
st.org podr_name,
st.org_code podr,
st.final_code,
st.age,
st.f_mes_code,
st.f_mes_name,
st.f_ksg_num,
st.f_cr_service_code,
ord.description,
null srv_org,
st.f_c_kslp,
to_number(REPLACE(st.f_mes_summ, '.', ',')) f_mes_summ,
st.f_kz,
st.f_cdiff,
st.f_cspec,
st.f_cpriv,
st.f_zp,
st.f_base,
decode(st.F_CR_MKB_CODE2, null, '', st.F_CR_MKB_CODE2) F_CR_MKB_CODE2,
decode(st.F_CR_PARAM_CODE, 'pbt', 'gibp30', st.F_CR_PARAM_CODE) F_CR_PARAM_CODE,
st.f_c_duration_case
from bra.interin_ksg st
inner join
(select r.chart_id, e.code, e.fullname description from mi_orders r
inner join od_vec_srvs e on e.id = r.r_service_id
where r.o_state = 'E' and r.r_status = 1 and e.stype not like 'ST_LAB' and e.fullname not in ('Коронароангиография*', 'Стентирование шунта')
) ord on st.f_cr_service_code = ord.code`

export const servStr = `select oms.fio, oms.c_i иб, hosp.c_i амб, oms.s_pol, oms.sn_pol, oms.dds, oms.in_date, oms.out_date, xm.html_text from st.ksg_list_v oms
left join fd.xml_regs xm on xm.case_history_id = oms.id
left join 
(SELECT srv.patient, srv.c_i, srv.d_u, count(srv.srv_id) usl_num from st.oms_pat_srv srv
inner join ec_srvs e on srv.srv_id = e.id
where  e.code in ('015064')
group by srv.patient,srv.c_i, srv.d_u
) hosp on oms.patient = hosp.patient where oms.out_date >= to_date('01.09.2021', 'dd.mm.yyyy') and hosp.c_i is not null and xm.doc_type in ( 'DISCHARGE_GENERAL_CONCLUSION_1', 'DISCHARGE_GENERAL_CONCLUSION_1_DC') and xm.html_text is not null`

export const hospStr = `select oms.fio, oms.c_i иб, oms.s_pol, oms.sn_pol, oms.dds, oms.in_date, oms.out_date, xm.html_text from st.ksg_list_v oms
left join fd.xml_regs xm on xm.case_history_id = oms.id
where oms.out_date >= to_date('01.09.2021', 'dd.mm.yyyy') and xm.doc_type in ( 'DISCHARGE_GENERAL_CONCLUSION_1', 'LEAD_GENERAL_CONCLUSION_1', 'DISCHARGE_GENERAL_CONCLUSION_1_DC') and oms.channel like 'Городская скорая помощь' and xm.html_text is not null`

export const ffoms = {
  rmp: xml,
  doms: xml,
  excel: ksg
};
