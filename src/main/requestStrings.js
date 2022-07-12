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
where lower(qu.title) = 'список оказанных услуг по иб' and trunc(oms.usl_date) between to_date('01.12.2021','dd.mm.yyyy') and to_date('30.12.2022','dd.mm.yyyy') 
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
where oms.id not in (select id from st.interin_ksg)
`;

const doc = `select doc.* from oms_pat_doc doc inner join oms_pat_pol pol on doc.patient = pol.patient`;
const pol = `select * from oms_pat_pol where sn_pol is not null and patient not like '33356'`;
const adr = `select adr.* from oms_pat_adr adr inner join oms_pat_pol pol on adr.patient = pol.patient`;
const pat = `select pat.* from oms_pat pat inner join oms_pat_pol pol on pat.patient = pol.patient `;
const history = `select mk.fio, mk.patient, mk.c_i, mk.t_ci, mk.mb_stat, decode(tal.talon_num, null, '', concat(mk.patient, mk.c_i)) ap_id, mk.h_typ, mk.src, mk.ord, mk.ishod, mk.rslt, mk.prog, mk.travma, mk.ds_p, mk.ds, mk.ds_s, mk.ds_o, smp.dord_n,
decode(tal.talon_num, null, '', concat(mk.patient, mk.c_i)) vmpap_id
from oms_pat_mk mk
inner join oms_pat_pol pol on mk.patient = pol.patient
left join smp_num smp on mk.med_id = smp.med_id 
left join a.t_smh_plans tal on smp.med_id = tal.t_med_chrt_id`;
const amb = `select srv.* from oms_pat_srv srv inner join oms_pat_pol pol on srv.patient = pol.patient`;
const move = `select distinct move.fio_pat, move.patient, move.c_i, move.org_type, move.org_pat, move.cod_u, move.fio_sot, to_date(move.d_b, 'dd.mm.yy') d_b, to_char(move.d_b, 'HH24:MI') d_time, move.kind, move.dds, move.cod, move.prog, move.tip, move.d_type, move.mcod, move.code, move.result, move.h_pays, move.h_date 
from oms_pat_move move
inner join st.ksg_list list on list.patient = move.patient
where list.channel like 'Городская скорая помощь' and move.kind like 'ПОЛОЖЕН'
union all
select distinct move.fio_pat, move.patient, move.c_i, move.org_type, move.org_pat, move.cod_u, move.fio_sot, to_date(move.d_b, 'dd.mm.yy') d_b, to_char(move.d_b, 'HH24:MI') d_time, move.kind, move.dds, move.cod, move.prog, move.tip, move.d_type, move.mcod, move.code, move.result, move.h_pays, move.h_date 
from oms_pat_move move
inner join st.ksg_list list on list.patient = move.patient
where list.channel like 'Городская скорая помощь' and move.kind like 'ПЕРЕВЕДЕН'
union all
select distinct move.fio_pat, move.patient, move.c_i, move.org_type, move.org_pat, move.cod_u, move.fio_sot, to_date(move.d_b, 'dd.mm.yy') d_b, to_char(move.d_b, 'HH24:MI') d_time, move.kind, move.dds, move.cod, move.prog, move.tip, move.d_type, move.mcod, move.code, move.result, move.h_pays, move.h_date 
from oms_pat_move move
inner join st.ksg_list list on list.patient = move.patient
where list.channel like 'Городская скорая помощь' and move.kind like 'ВЫПИСАН'
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
st.f_cpriv,
st.f_zp,
st.f_base,
decode(st.F_CR_MKB_CODE2, null, '', st.F_CR_MKB_CODE2) F_CR_MKB_CODE2,
decode(st.F_CR_PARAM_CODE, 'pbt', 'gibp30', st.F_CR_PARAM_CODE) F_CR_PARAM_CODE,
st.f_c_duration_case,
st.f_cr_service_code,
tal.talon_num tal_num,
tal.talon_date tal_d,
st.json_data
from st.interin_ksg st
inner join  a.t_smh_plans tal on tal.t_med_chrt_id = st.id
where tal.talon_num is not null`;

export const vmpReq = `select 
v.patient,
v.id, 
v.fio,
v.c_i,
v.dds,
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
v.cod,
v.in_date,
v.out_date,
v.org podr_name,
v.org_code podr,
v.final_code,
v.age,
tal.talon_num tal_num,
tal.talon_date tal_d,
f.json_data
from st.ksg_list_v v 
left join ( select parent_id, json_data from wi.xs$fd where doc_type='FD.PROTOCOL_IMPLANTS' and status <99) f on v.id = f.parent_id
inner join a.t_smh_plans tal on tal.t_med_chrt_id = v.id where v.cod like '200%' and v.channel not like 'Городская скорая помощь'`

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
st.f_c_kslp,
st.f_mes_summ,
st.f_kz,
st.f_cdiff,
st.f_cspec,
st.f_cpriv,
st.f_zp,
st.f_base,
decode(st.F_CR_MKB_CODE2, null, '', st.F_CR_MKB_CODE2) F_CR_MKB_CODE2,
decode(st.F_CR_PARAM_CODE, 'pbt', 'gibp30', st.F_CR_PARAM_CODE) F_CR_PARAM_CODE,
st.f_c_duration_case,
st.json_data
from st.interin_ksg st`

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
