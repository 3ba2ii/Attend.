import React from 'react';
import Carousel from 'react-material-ui-carousel';

function CarouselComponent({ items }) {
  return (
    <Carousel className='carousel-container'>
      {items.map((item, i) => (
        <Item key={i} item={item} className='carousel-item' />
      ))}
    </Carousel>
  );
}

function Item(props) {
  return (
    <div className='carousel-paper'>
      <img src={props.item.image} alt='login-img' className='carousel-img' />
      <h3>{props.item.name}</h3>
      <p>{props.item.description}</p>
    </div>
  );
}
export default CarouselComponent;
