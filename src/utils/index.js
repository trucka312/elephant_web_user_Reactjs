export const getMeta = (metaName) => {
  const metas = document.getElementsByTagName("meta");
  for (let i = 0; i < metas.length; i++) {
    if (metas[i].getAttribute("name") === metaName) {
      return metas[i].getAttribute("content");
    }
  }
  return "";
};
export const store_code =
  getMeta("store_code") === ""
    ? window.location.hostname.split(".")[0]
    : getMeta("store_code");
export const formatNumber = (str) => {
  if (str === undefined || str === null) return "";
  const strFormat = str
    .toString()
    .replace(/[A-Za-z`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/g, "");
  if (Number(strFormat) >= 1000) {
    return strFormat
      .split("")
      .reverse()
      .reduce((prev, next, index) => {
        return (index % 3 ? next : next + ".") + prev;
      });
  } else if (Number(strFormat) >= 0 && Number(strFormat) < 1000) {
    return Number(strFormat);
  } else {
    return "";
  }
};

export const formatBankAccountNumber = (str) => {
  if (str === undefined || str === null) return "";
  const strFormat = str
    .toString()
    .replace(/[^\d]/g, ""); // get only number

  const chunks = [];
  let i = strFormat.length;
  while (i > 0) {
    const chunk = strFormat.substring(Math.max(i - 4, 0), i);
    chunks.unshift(chunk);
    i -= 4;
  }

  return chunks.join("  ");
};

export const formatPriceOrContact = (p) => {
  if (!p) return "Liên hệ";
  p = Math.round(p);
  p = p.toString();
  let n = 0;
  let tmp = "";
  let rs = p[0];
  for (let i = p.length - 1; i > 0; i--) {
    n++;
    tmp += p[i];
    if (n % 3 === 0) {
      tmp += ".";
    }
  }
  for (let i = tmp.length - 1; i >= 0; i--) {
    rs += tmp[i];
  }
  if (rs == 0) return "Liên hệ";
  return "₫" + rs;
};
export const formatPrice = (p, NOD = false) => {
  if (!p) return "0";
  p = Math.round(p);
  p = p.toString();
  let n = 0;
  let tmp = "";
  let rs = p[0];
  for (let i = p.length - 1; i > 0; i--) {
    n++;
    tmp += p[i];
    if (n % 3 === 0) {
      tmp += ".";
    }
  }
  for (let i = tmp.length - 1; i >= 0; i--) {
    rs += tmp[i];
  }
  if (NOD == true) return rs;
  return "₫" + rs;
};

export const getQueryParams = (name) => {
  return new URLSearchParams(window ? window.location.search : {}).get(name);
};

export const getPathByIndex = (index) => {
  const path = window.location.pathname;
  const parts = path.split("/");

  if (index >= 0 && index < parts.length) {
    return parts[index];
  }
  return null;
};

export const contactOrNumber = (data) => {
  if (getChannel() == "IKIPOS") {
    return data;
  } else {
    var string = data.slice(0, -2);
    var newString = string
      .toString()
      .replace(/\./g, "")
      .toString()
      .replace(/,/g, "")
      .toString()
      .replace(/-/g, "")
      .toString();
    if (newString == 0) {
      return "0đ";
    } else {
      return data;
    }
  }
};

export const getChannel = () => {
  if (window.location.href.includes("pos.")) {
    return "IKIPOS";
  }
  return "IKITECH";
};

export const format = (number) => {
  var num = Number(number);
  return num.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });
};

export const findCategoryNames = (categories, recommendCategory) => {
  const result = [];

  const findNameById = (id, category) => {
    if (category?.main_id === id) {
      return {
        id: category?.main_id,
        name: category?.name,
        children: category.children,
      };
    } else if (category?.children && category?.children.length > 0) {
      for (const child of category.children) {
        const name = findNameById(id, child);
        if (name) return { id: id, name: name };
      }
    }
    return null;
  };

  for (const item of recommendCategory) {
    let currentCategory = null;
    if (!item && !item.length) continue;
    const categoryNames = item.map((mainId) => {
      if (currentCategory) {
        currentCategory = currentCategory?.children.find(
          (child) => child.main_id === mainId
        );
      } else {
        currentCategory =
          categories && categories.length
            ? categories.find((category) => category.main_id === mainId)
            : [];
      }
      return currentCategory ? findNameById(mainId, currentCategory) : null;
    });
    result.push(categoryNames);
  }

    for (const item of recommendCategory) {
      let currentCategory = null;
      if(!item && !item.length) continue;
      const categoryNames = item.map((mainId) => {
        if (currentCategory) {
          currentCategory = currentCategory.children.find(
            (child) => child.main_id === mainId
          );
        } else {
          if(categories != null) {
            currentCategory = categories.find(
              (category) => category.main_id === mainId
            );
          }
         
        }
        return currentCategory ? findNameById(mainId, currentCategory) : null;
      });
      result.push(categoryNames);
    }
  

  
  return result;
};

export const findParentsByChildrenId = (categories, targetId) => {
  const hierarchy = [];

  function findCategoryById(currentCategories, categoryId) {
    if (!currentCategories || currentCategories.length === 0) return;
    for (const category of currentCategories) {
      if (category.main_id === categoryId) {
        hierarchy.unshift({
          id: category.main_id,
          name: category.name,
          children: category.children,
        });
        if (category.parent_id) {
          findCategoryById(categories, category.parent_id);
        }
        break;
      } else if (category.children) {
        findCategoryById(category.children, categoryId);
      }
    }
  }

  findCategoryById(categories, targetId);
  return hierarchy;
};
