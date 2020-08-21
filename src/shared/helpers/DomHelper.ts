// export class DomHelper {
//   static waitUntilElementIsReady(selector: string, callback: any, checkPeriod?: number): void {
//     const selectors = selector.split(",").map(selectorUnit => selectorUnit.trim());
//     const elementCount = selectors.length;

//     if (!checkPeriod) {
//       checkPeriod = 100;
//     }

//     const checkExist = setInterval(() => {
//       let foundElementCount = 0;
//       for (const selectorUnit of selectors) {
//         if (selectorUnit[0] === "#") {
//           const idSelector = selectorUnit.replace("#", "");
//           foundElementCount = foundElementCount + (document.getElementById(idSelector) ? 1 : 0);
//         } else if (selectorUnit[0] === ".") {
//           const classSelector = selectorUnit.replace(".", "");
//           foundElementCount = foundElementCount + (document.getElementsByClassName(classSelector) ? 1 : 0);
//         }
//       }

//       if (foundElementCount >= elementCount) {
//         clearInterval(checkExist);
//         callback();
//       }
//     }, checkPeriod);
//   }

//   static createElement(tag: string, attributes: any[]): any {
//     const el = document.createElement(tag);
//     for (const attribute of attributes) {
//       el.setAttribute(attribute.key, attribute.value);
//     }

//     return el;
//   }

//   static getElementByAttributeValue(tag: string, attribute: string, value: string) {
//     const els = document.getElementsByTagName(tag);
//     if (!els) {
//       return undefined;
//     }

//     // https://github.com/microsoft/TypeScript/issues/2695
//     // tslint:disable-next-line:prefer-for-of
//     for (let i = 0; i < els.length; i++) {
//       const el = els[i];
//       if (el.getAttribute(attribute) === value) {
//         return el;
//       }
//     }

//     return undefined;
//   }
// }
