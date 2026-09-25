import { useMemo, useState } from 'react'

const filters = ['전체', '꿈', '기억', '오류', '금지']

function ImageHall({ images }) {
  const [active, setActive] = useState('전체')
  const visible = useMemo(
    () => (active === '전체' ? images : images.filter((image) => image.tag === active)),
    [active, images],
  )

  return (
    <section className="image-hall section-shell" id="image-hall">
      <div className="hall-header">
        <div>
          <p className="section-kicker">제2전시실 / 이미지 회랑</p>
          <h2 data-reveal>기억된 이미지는 평평하게 걸려 있기를 거부합니다.</h2>
        </div>
        <div className="filter-rail" aria-label="이미지 분류">
          {filters.map((filter) => (
            <button
              className={active === filter ? 'is-active' : ''}
              key={filter}
              type="button"
              onClick={() => setActive(filter)}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>
      <div className="frame-grid">
        {visible.map((image, index) => (
          <article className={`gallery-frame tone-${index % 4}`} key={image.id} data-cursor="보기">
            <div className="image-surface">
              <img src={image.src} alt="" loading="lazy" />
              <span>{image.mark}</span>
            </div>
            <p>{image.tag}</p>
            <h3>{image.title}</h3>
          </article>
        ))}
      </div>
    </section>
  )
}

export default ImageHall
