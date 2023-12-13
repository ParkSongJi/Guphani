import * as pharmacyRepository from '../data/pharmacy.js';

// 약국데이터를 불러와서 MongoDB에 저장
export async function setAllPharmacy(req, res ) {
    const result = await pharmacyRepository.setPharmacyDataByCityArray()
    res.json(result)
}
export async function getNearPharmacy(req, res ) {
    const { latitude,longitude } = req.body;
    const result = await pharmacyRepository.getNearPharmacy(latitude,longitude)
    res.json(result)
}
// export async function getAllPharmacy(req, res ) {
//     const { latitude,longitude } = req.body;
//     const result = await pharmacyRepository.getAllPharmacy(latitude,longitude)
//     res.json(result)
// }

// // 공휴일약국 불러오기
// export async function getHolidayPharmacy(req, res ) {
//     const result = await pharmacyRepository.getHoliday()
//     res.json(result)
// }