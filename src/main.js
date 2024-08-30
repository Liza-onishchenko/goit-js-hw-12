import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import axios from 'axios';



import { fetchPhotos } from "./js/pixabay-api";
import { createGalleryCardTemplate } from "./js/render-functions";
import { displayPhotos } from "./js/render-functions";
import { showLoadingIndicator } from "./js/render-functions";
import { hideLoadingIndicator } from "./js/render-functions";



const searchFormEl = document.querySelector('.js-search-form');
const galleryEl = document.querySelector('.js-gallery');
const loadingIndicatorEl = document.querySelector('.loader');
const lightbox = new SimpleLightbox('.gallery-card a');
const loadMoreBtnEl = document.querySelector('.js-load-more');


let currentPage = 1;
const itemPerPage = 15;
let searchValue = '';


const onSearchFormSubmit = async event => {
  try{
      
    event.preventDefault();

     searchValue = searchFormEl.elements.user_query.value.trim();   //  oчищення галереї ініціалізація змін

     currentPage = 1; //  обнуляє номер групи

     galleryEl.innerHTML = ''; // Очистка галереї

     loadMoreBtnEl.classList.add('is-hidden');

     if(searchValue === "") {
        iziToast.error({
            title: "Error",
            message: "Sorry, there are no images matching your search query. Please try again!",
            position: 'topRight',
        });
        
        return;
      }

      showLoadingIndicator(loadingIndicatorEl);//індикатор завантаження

      
      const response = await fetchPhotos(searchValue, currentPage, itemPerPage);//Запит до АРІ   

      
      if (response.data.hits.length === 0) {
            iziToast.warning({
                title: "No results",
                message: "Sorry, there are no images matching your search query. Please try again!",
                position: 'topRight',
            });
           
            return;
        }

        
      displayPhotos(response.data.hits, galleryEl, lightbox);// Відображення результату

       
      loadMoreBtnEl.classList.remove('is-hidden');  //Показати кнопку load more

    } catch (err) {
       iziToast.error({
        title: "Error",
        message: "Something went wrong! Please try again later.",
        position: 'topRight',
        });
      console.error("Error fetching images:", err);
      
    }  finally {

      hideLoadingIndicator(loadingIndicatorEl); //Сховати індикатор завантаження

      searchFormEl.elements.user_query.value = '';
    } 
   
};

const onLoadMoreBtnClick = async event => { 
    try {
      
      showLoadingIndicator(loadingIndicatorEl); //показує індикатор під кнопкою

      currentPage ++;  //Номер групи

      const response = await fetchPhotos(searchValue, currentPage, itemPerPage);//запит на сервер за наступною групою

      galleryEl.insertAdjacentHTML('beforeend', response.data.hits.map(createGalleryCardTemplate).join(''));// //Відмальовую нові зображення
      lightbox.refresh(); //оновлення після додавання нових зображень
      searchFormEl.reset();

      
      const totalPages = Math.ceil(response.data.totalHits / itemPerPage);//обчислення стр  кількість
      if (currentPage >= totalPages) {          //якщо кінець колекціі  
        loadMoreBtnEl.classList.add('is-hidden'); //хова кнопку
         iziToast.info({
            message: "We're sorry, but you've reached the end of search results",
            position: 'topRight',
        });
      }

      smoothScroll();

    } catch(err) {
        console.log(err);
    } finally {
        hideLoadingIndicator(loadingIndicatorEl);  //Приховує індикатор завантаження
    }
};


const smoothScroll = () => {
    const { height } = galleryEl.firstElementChild.getBoundingClientRect();
    window.scrollBy({
      top: height * 2,
      behavior: 'smooth',
    });
  };

searchFormEl.addEventListener('submit', onSearchFormSubmit);
loadMoreBtnEl.addEventListener('click', onLoadMoreBtnClick);