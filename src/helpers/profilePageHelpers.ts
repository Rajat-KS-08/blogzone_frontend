import moment from "moment";

export const countries = [
  // same countries array as before
  "United States",
  "Canada",
  "United Kingdom",
  "Australia",
  "Germany",
  "France",
  "Italy",
  "Spain",
  "Brazil",
  "Mexico",
  "China",
  "India",
  "Japan",
  "South Korea",
  "Russia",
  "South Africa",
  "Egypt",
  "Turkey",
  "Saudi Arabia",
  "Argentina",
  "Netherlands",
  "Sweden",
  "Norway",
  "Denmark",
  "Finland",
  "Poland",
  "Portugal",
  "Greece",
  "Belgium",
  "Switzerland",
  "New Zealand",
  "Colombia",
  "Chile",
  "Thailand",
  "Vietnam",
  "Malaysia",
  "Singapore",
  "Indonesia",
  "Philippines",
  "United Arab Emirates",
  "Israel",
  "Ireland",
  "Austria",
  "Czech Republic",
  "Hungary",
  "Romania",
  "Ukraine",
  "Morocco",
  "Peru",
  "Pakistan",
  "Bangladesh",
];

export const allowedProfileNameChars = /^[A-Za-z0-9!@._-]*$/;

export const calculateAgeString = (dob: any) => {
  if (!dob) return null;

  const dobMoment = moment(dob.toDate ? dob.toDate() : dob); // convert Dayjs to Moment
  const now = moment();

  if (dobMoment.isAfter(now)) return null;

  const years = now.diff(dobMoment, "years");
  const months = now.diff(dobMoment.clone().add(years, "years"), "months");

  return `${years} Years${months > 0 ? ` and ${months} Months` : ""} of age`;
};

export const getBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file); // this gives base64 string
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};