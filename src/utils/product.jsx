import { contactOrNumber, format } from ".";

export const formatPriceProduct = (product) => {
    const {
      product_discount,
      min_price,
      max_price,
      discount_percent,
      distributes,
    } = product;
    return (
      <div>
        {product_discount == null && (
          <span className="eea">
            {min_price === max_price ? (
              <span>
                {" "}
                {contactOrNumber(
                  format(
                    Number(
                      discount_percent == null
                        ? min_price
                        : min_price - min_price * discount_percent * 0.01
                    )
                  )
                )}{" "}
              </span>
            ) : distributes && distributes.length == 0 ? (
              contactOrNumber(
                format(
                  Number(
                    discount_percent == null
                      ? min_price
                      : min_price - min_price * discount_percent * 0.01
                  )
                )
              )
            ) : (
              <span className="ae">
                {format(
                  Number(
                    discount_percent == null
                      ? min_price
                      : min_price - min_price * discount_percent * 0.01
                  )
                )}
                {" - "}
                {format(
                  Number(
                    discount_percent == null
                      ? max_price
                      : max_price - max_price * discount_percent * 0.01
                  )
                )}
              </span>
            )}
          </span>
        )}
  
        {product_discount && (
          <div
            className="a"
            style={{
              float: "left",
              paddingRight: 20,
            }}
          >
            {min_price === max_price ? (
              contactOrNumber(format(Number(min_price)))
            ) : (
              <div className="row e">
                <div style={{}}>
                  {format(Number(min_price))}
                  {" - "}
                  {format(Number(max_price))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };