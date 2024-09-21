import './styles/style.css'
import AirDatepicker from 'air-datepicker';
import 'air-datepicker/air-datepicker.css';
// =======IMAGES===========
import logoSrc from './assets/images/logo.webp';
const logo = document.querySelector('#logo');
logo.src = logoSrc;

import dateSrc from './assets/images/type date.webp';
const dateInputImg = document.querySelector('#custom-date-input');
dateInputImg.src = dateSrc;

import dropArrowSrc from './assets/images/drop_down_arrow.webp';
const dropArrows = document.querySelectorAll(".drop-arrow");
dropArrows.forEach(dropArrow=>dropArrow.src=dropArrowSrc);




// ----------DATE PICKER---------------
new AirDatepicker('#el', {
  dateFormat(date) {
      return date.toLocaleString('ja', {
          year: 'numeric',
          day: '2-digit',
          month: 'long'
      });
  }
})