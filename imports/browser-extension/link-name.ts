/**
 * Contains the names of all links within this package. 
 * 
 * @example
```ts
const BrowserExtensionTypeLinkId = await deep.id(
   PACKAGE_NAME,
   LinkName[LinkName.Camera]
)
```
 */
export enum LinkName {
    BrowserExtension,
    Page,
    Tab,
    Active,
    TabTitle,
    TabUrl,
    PageTitle,
    PageUrl,
    VisitCount,
    TypedCount,
    LastVisitTime
 }