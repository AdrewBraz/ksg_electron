// The reporting interval follows the supplied September–October 2026 register.
export const service1974Query = `
with period as (
  select date '2026-09-01' first_day, date '2026-11-01' next_day from dual
), admissions as (
  select st.patient, st.id history_id, st.in_date, st.out_date, st.dds,
         ma.code ak, o.s_sht_zap_id practitioner, o.r_date, o.id order_id
    from st.ksg_list st
    join t_med_chrts mi on mi.id = st.id and mi.status <> 99
    join t_med_chrts ma on ma.t_person_id = mi.t_person_id
                       and ma.kind = 'АК' and ma.status <> 99
    join od_orders o on o.chart_id = ma.id
    cross join period p
   where st.usl_ok = 1
     and st.patient not in ('33356', '89912', '63463')
     and st.out_date >= p.first_day and st.out_date < p.next_day
     and o.status <> 99 and o.o_state = 'E' and o.r_status = 1
     and o.payment_type_code = 3 and o.service_id in (134551, 130340)
     and o.r_date between add_months(mi.in_date, -2) and mi.in_date
     and exists (select 1 from bra.oms_pat_mk mk
                  join oms_pat_pol pol on pol.patient = mk.patient
                  where mk.patient = st.patient and mk.c_i = ma.code)
     and exists (select 1 from queries qu where qu.id = 906)
     and exists (select 1 from t_tl_tpays tp where tp.t_med_chrt_id = ma.id
                  and tp.status <> 99 and tp.lovquota_id = 6015)
     and exists (select 1 from s_dep_ways w where w.t_med_chrt_id = mi.id
                  and w.status = 0 and w.kind <> 'ПО' and w.result is not null
                  and w.out_date >= p.first_day and w.out_date < p.next_day)
     and exists (select 1 from wi.xs$fd fd where fd.parent_id = st.id
                  and fd.doc_type = 'FD.EPICRISIS.EPICRISIS_EXCERPT_IB')
), ranked as (
  select a.*, row_number() over (
    partition by patient, trunc(out_date, 'MM')
    order by in_date, history_id, r_date desc, order_id desc
  ) rn from admissions a
)
select to_char(patient) patient, ak c_i, dds ds, to_char(practitioner) cod_u,
       to_char(out_date, 'YYYY-MM-DD') service_day
from ranked where rn = 1`;

export function validate1974Links(services, tables) {
  for (const service of services) {
    if (!service.C_I || !service.DS?.trim() || !service.SERVICE_DAY) {
      throw new Error('1974: отсутствует АК, итоговый диагноз или дата выписки.');
    }
  }
  for (const name of ['PO', 'PA', 'AD', 'DU', 'MB']) {
    const key = name === 'MB'
      ? row => JSON.stringify([String(row.PATIENT), String(row.C_I)])
      : row => String(row.PATIENT);
    const keys = new Set(tables[name].map(key));
    for (const service of services) {
      if (!keys.has(key(service))) {
        throw new Error(`1974: нет связанной записи в ${name} для пациента ${service.PATIENT}, АК ${service.C_I}.`);
      }
    }
  }
}
