import {
  useDeferredValue,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import CartPopup from "../components/CartPopup";
import { Category } from "../components/Category";
import Menulogo from "../assets/Menulogo.png";
import ScrollContainer from "react-indiana-drag-scroll";
import { cartAtom } from "../data/cartAtom";
import data from "../data/data.json";
import { themeAtom } from "../data/themeAtom";
import { useAtom } from "jotai";
import { useLanguage } from "../context/LanguageContext";

export default function Index() {
  const [language] = useLanguage();

  const [cart] = useAtom(cartAtom);
  const [theme, setTheme] = useAtom(themeAtom);
  const [query, setQuery] = useState("");

  const parentScrollContainerRef = useRef(null);
  const [activeCategory, setActiveCategory] = useState(0);

  const deferredActiveCategory = useDeferredValue(activeCategory);

  const onPress = (e) => {
    e.preventDefault();
    const id = e.target.getAttribute("data-to-scrollSpy-id");
    const element = document.getElementById(id);
    const parentScrollContainer = parentScrollContainerRef.current;

    if (element && parentScrollContainer) {
      const offsetTop = element.offsetTop;
      parentScrollContainer.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const parentScrollContainer = parentScrollContainerRef.current;

    const handleScroll = () => {
      const children = Array.from(parentScrollContainer.children);

      const itemsInView = [];

      for (const child of children) {
        const { top, bottom } = child.getBoundingClientRect();
        if (top <= 140 && bottom >= 140) {
          itemsInView.push(child.id);
        }
      }

      if (itemsInView.length > 0) {
        setActiveCategory(itemsInView[0]);
      }

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(
          (entry) => {
            if (entry.isIntersecting) {
              setActiveCategory(entry.target.id);
            }
          },
          {
            root: parentScrollContainer,
            threshold: 0.5,
          }
        );
      });

      children.forEach((child) => observer.observe(child));
    };

    parentScrollContainer.addEventListener("scroll", handleScroll);

    return () =>
      parentScrollContainer.removeEventListener("scroll", handleScroll);
  }, []);

  useLayoutEffect(() => {
    document?.documentElement?.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

  return (
    <>
      <div className="menu__home__content">
        <div className="menu__home__content__left">
          <div className="menu__home__content__left__links">
            {data.map((category, index) => (
              <button
                key={index}
                onClick={onPress}
                data-to-scrollSpy-id={index}
                style={{ animationDelay: `${index * 0.1}s` }}
                className={
                  "menu__home__content__left__link fadeIn " +
                  (parseInt(deferredActiveCategory) === index ? "active" : "")
                }
              >
                <img
                  src={category.imageUrl}
                  alt={language === "ar" ? category.nameAr : category.name}
                />
                {language === "ar" ? category.nameAr : category.name}
              </button>
            ))}
          </div>
        </div>
        <div className="menu__home__content__right">
          <div className="menu__home__content__right__content">
            <div className="menu__home__content__right__content__top">
              <div className="menu__home__content__right__content__top__logo fadeIn">
                <img
                  loading="lazy"
                  src={
                    language === "en" && theme === "light"
                      ? Menulogo
                      : language === "en" && theme === "dark"
                      ? Menulogo
                      : language === "ar" && theme === "light"
                      ? Menulogo
                      : Menulogo
                  }
                  alt="logo"
                />
              </div>
              <div className="menu__home__content__right__content__top__content">
                <div className="menu__home__content__right__content__top__search fadeIn">
                  <div className="menu__home__content__right__content__top__search__input">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M8.58144 17.1629C3.85118 17.1629 0 13.3117 0 8.58144C0 3.85118 3.85118 0 8.58144 0C13.3117 0 17.1629 3.85118 17.1629 8.58144C17.1629 13.3117 13.3117 17.1629 8.58144 17.1629ZM8.58144 1.25582C4.5377 1.25582 1.25582 4.54607 1.25582 8.58144C1.25582 12.6168 4.5377 15.9071 8.58144 15.9071C12.6252 15.9071 15.9071 12.6168 15.9071 8.58144C15.9071 4.54607 12.6252 1.25582 8.58144 1.25582Z"
                        fill="#9BA8B7"
                      />
                      <path
                        d="M17.3725 18C17.2134 18 17.0544 17.9414 16.9288 17.8158L15.2544 16.1414C15.0116 15.8986 15.0116 15.4967 15.2544 15.2539C15.4972 15.0111 15.899 15.0111 16.1418 15.2539L17.8162 16.9284C18.059 17.1712 18.059 17.573 17.8162 17.8158C17.6906 17.9414 17.5316 18 17.3725 18Z"
                        fill="#9BA8B7"
                      />
                    </svg>
                    <input
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder={
                        language === "ar"
                          ? "بحث عن منتج"
                          : "Search for a product"
                      }
                    />
                  </div>
                </div>
                <div className="menu__home__content__right__content__top__cart fadeIn">
                  <svg
                    width="21"
                    height="21"
                    viewBox="0 0 21 21"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1 1H2.65301C3.67901 1 4.4865 1.8835 4.401 2.9L3.6125 12.362C3.4795 13.9105 4.70499 15.2405 6.26299 15.2405H16.3805C17.7485 15.2405 18.9455 14.1195 19.05 12.761L19.563 5.636C19.677 4.059 18.48 2.7765 16.8935 2.7765H4.62901"
                      stroke="#FB7D37"
                      strokeWidth="1.425"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M14.5374 20C15.1932 20 15.7249 19.4684 15.7249 18.8125C15.7249 18.1566 15.1932 17.625 14.5374 17.625C13.8815 17.625 13.3499 18.1566 13.3499 18.8125C13.3499 19.4684 13.8815 20 14.5374 20Z"
                      stroke="#FB7D37"
                      strokeWidth="1.425"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M6.9375 20C7.59334 20 8.125 19.4684 8.125 18.8125C8.125 18.1566 7.59334 17.625 6.9375 17.625C6.28166 17.625 5.75 18.1566 5.75 18.8125C5.75 19.4684 6.28166 20 6.9375 20Z"
                      stroke="#FB7D37"
                      strokeWidth="1.425"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M7.6499 6.70001H19.0499"
                      stroke="#FB7D37"
                      strokeWidth="1.425"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div className="menu__home__content__right__content__top__cart__count">
                    {language === "ar" && "عربة التسوق "}
                    {cart.length > 99 ? "99+" : cart.length}
                    {language === "en" && " items"}
                  </div>
                </div>
                <button
                  className="menu__home__content__right__content__top__darklightmood fadeIn"
                  onClick={toggleTheme}
                >
                  {theme === "light" ? (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M9.33333 2.66667V0.666667C9.33333 0.489856 9.40357 0.320286 9.5286 0.195262C9.65362 0.0702379 9.82319 0 10 0C10.1768 0 10.3464 0.0702379 10.4714 0.195262C10.5964 0.320286 10.6667 0.489856 10.6667 0.666667V2.66667C10.6667 2.84348 10.5964 3.01305 10.4714 3.13807C10.3464 3.2631 10.1768 3.33333 10 3.33333C9.82319 3.33333 9.65362 3.2631 9.5286 3.13807C9.40357 3.01305 9.33333 2.84348 9.33333 2.66667ZM10 4.66667C8.94517 4.66667 7.91402 4.97946 7.03696 5.5655C6.1599 6.15153 5.47631 6.98448 5.07264 7.95902C4.66898 8.93356 4.56336 10.0059 4.76915 11.0405C4.97493 12.075 5.48288 13.0254 6.22876 13.7712C6.97464 14.5171 7.92495 15.0251 8.95952 15.2309C9.99408 15.4366 11.0664 15.331 12.041 14.9274C13.0155 14.5237 13.8485 13.8401 14.4345 12.963C15.0205 12.086 15.3333 11.0548 15.3333 10C15.3318 8.58599 14.7694 7.23033 13.7695 6.23047C12.7697 5.23061 11.414 4.66821 10 4.66667ZM4.195 5.13833C4.32009 5.26343 4.48976 5.3337 4.66667 5.3337C4.84358 5.3337 5.01324 5.26343 5.13833 5.13833C5.26343 5.01324 5.3337 4.84358 5.3337 4.66667C5.3337 4.48976 5.26343 4.32009 5.13833 4.195L3.805 2.86167C3.67991 2.73657 3.51024 2.6663 3.33333 2.6663C3.15642 2.6663 2.98676 2.73657 2.86167 2.86167C2.73657 2.98676 2.6663 3.15642 2.6663 3.33333C2.6663 3.51024 2.73657 3.67991 2.86167 3.805L4.195 5.13833ZM4.195 14.8617L2.86167 16.195C2.73657 16.3201 2.6663 16.4898 2.6663 16.6667C2.6663 16.8436 2.73657 17.0132 2.86167 17.1383C2.98676 17.2634 3.15642 17.3337 3.33333 17.3337C3.51024 17.3337 3.67991 17.2634 3.805 17.1383L5.13833 15.805C5.20027 15.7431 5.24941 15.6695 5.28293 15.5886C5.31645 15.5077 5.3337 15.4209 5.3337 15.3333C5.3337 15.2457 5.31645 15.159 5.28293 15.0781C5.24941 14.9971 5.20027 14.9236 5.13833 14.8617C5.07639 14.7997 5.00286 14.7506 4.92193 14.7171C4.841 14.6836 4.75426 14.6663 4.66667 14.6663C4.57907 14.6663 4.49233 14.6836 4.4114 14.7171C4.33047 14.7506 4.25694 14.7997 4.195 14.8617ZM15.3333 5.33333C15.4209 5.3334 15.5076 5.31622 15.5886 5.28276C15.6695 5.2493 15.743 5.20022 15.805 5.13833L17.1383 3.805C17.2634 3.67991 17.3337 3.51024 17.3337 3.33333C17.3337 3.15642 17.2634 2.98676 17.1383 2.86167C17.0132 2.73657 16.8436 2.6663 16.6667 2.6663C16.4898 2.6663 16.3201 2.73657 16.195 2.86167L14.8617 4.195C14.7683 4.28824 14.7047 4.40707 14.679 4.53646C14.6532 4.66585 14.6664 4.79998 14.7169 4.92186C14.7674 5.04374 14.8529 5.1479 14.9627 5.22115C15.0724 5.29439 15.2014 5.33344 15.3333 5.33333ZM15.805 14.8617C15.6799 14.7366 15.5102 14.6663 15.3333 14.6663C15.1564 14.6663 14.9868 14.7366 14.8617 14.8617C14.7366 14.9868 14.6663 15.1564 14.6663 15.3333C14.6663 15.5102 14.7366 15.6799 14.8617 15.805L16.195 17.1383C16.2569 17.2003 16.3305 17.2494 16.4114 17.2829C16.4923 17.3165 16.5791 17.3337 16.6667 17.3337C16.7543 17.3337 16.841 17.3165 16.9219 17.2829C17.0029 17.2494 17.0764 17.2003 17.1383 17.1383C17.2003 17.0764 17.2494 17.0029 17.2829 16.9219C17.3165 16.841 17.3337 16.7543 17.3337 16.6667C17.3337 16.5791 17.3165 16.4923 17.2829 16.4114C17.2494 16.3305 17.2003 16.2569 17.1383 16.195L15.805 14.8617ZM3.33333 10C3.33333 9.82319 3.2631 9.65362 3.13807 9.5286C3.01305 9.40357 2.84348 9.33333 2.66667 9.33333H0.666667C0.489856 9.33333 0.320286 9.40357 0.195262 9.5286C0.0702379 9.65362 0 9.82319 0 10C0 10.1768 0.0702379 10.3464 0.195262 10.4714C0.320286 10.5964 0.489856 10.6667 0.666667 10.6667H2.66667C2.84348 10.6667 3.01305 10.5964 3.13807 10.4714C3.2631 10.3464 3.33333 10.1768 3.33333 10ZM10 16.6667C9.82319 16.6667 9.65362 16.7369 9.5286 16.8619C9.40357 16.987 9.33333 17.1565 9.33333 17.3333V19.3333C9.33333 19.5101 9.40357 19.6797 9.5286 19.8047C9.65362 19.9298 9.82319 20 10 20C10.1768 20 10.3464 19.9298 10.4714 19.8047C10.5964 19.6797 10.6667 19.5101 10.6667 19.3333V17.3333C10.6667 17.1565 10.5964 16.987 10.4714 16.8619C10.3464 16.7369 10.1768 16.6667 10 16.6667ZM19.3333 9.33333H17.3333C17.1565 9.33333 16.987 9.40357 16.8619 9.5286C16.7369 9.65362 16.6667 9.82319 16.6667 10C16.6667 10.1768 16.7369 10.3464 16.8619 10.4714C16.987 10.5964 17.1565 10.6667 17.3333 10.6667H19.3333C19.5101 10.6667 19.6797 10.5964 19.8047 10.4714C19.9298 10.3464 20 10.1768 20 10C20 9.82319 19.9298 9.65362 19.8047 9.5286C19.6797 9.40357 19.5101 9.33333 19.3333 9.33333Z"
                        fill="#002350"
                      />
                    </svg>
                  ) : (
                    <svg
                      width="17"
                      height="19"
                      viewBox="0 0 17 19"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M9.35487 18.7097C12.2403 18.7097 14.8757 17.397 16.6216 15.2458C16.8799 14.9276 16.5983 14.4627 16.1991 14.5387C11.6604 15.4031 7.49241 11.9232 7.49241 7.34153C7.49241 4.70236 8.90522 2.27546 11.2014 0.968741C11.5554 0.767319 11.4663 0.230693 11.0641 0.156402C10.5003 0.0524359 9.9282 8.53756e-05 9.35487 0C4.19109 0 0 4.18452 0 9.35487C0 14.5187 4.18452 18.7097 9.35487 18.7097Z"
                        fill="#fb7d37"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
          <div className="menu__home__content__right__mobilebar">
            <ScrollContainer className="menu__home__content__right__mobilebar__links">
              {data.map((category, index) => (
                <button
                  key={index}
                  onClick={onPress}
                  style={{ animationDelay: `${index * 0.1}s` }}
                  data-to-scrollSpy-id={index}
                  className={
                    "menu__home__content__right__mobilebar__link " +
                    (activeCategory === index ? "active" : "")
                  }
                >
                  {language === "ar" ? category.nameAr : category.name}
                </button>
              ))}
            </ScrollContainer>
          </div>
          <div className="menu__home__content__right__content__bottom__wrapper fadeIn">
            <div
              ref={parentScrollContainerRef}
              className="menu__home__content__right__content__bottom"
            >
              {data.map((category, index) => (
                <Category
                  key={index}
                  index={index}
                  category={category}
                  products={category.products?.filter((product) =>
                    (language === "ar" ? product.nameAr : product.name)
                      .toLowerCase()
                      .includes(query.toLowerCase())
                  )}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      <CartPopup />
    </>
  );
}
