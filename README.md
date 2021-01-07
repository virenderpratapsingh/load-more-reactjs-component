# Load More Component In ReactJS - A Recursive Approach
## The problem…
During a project, we thought of creating a page which scrolls infinitely, i.e whenever the bottom of the page is reached, we load the next page and so on.

Initially we explored some similar open-source Components, but there was a common thing in all the available Components - they concat the data of each page and render them all cumulatively. Say for example, if the first page contains 20 items and a request is made for the next page. The data now contains 40 items which are rendered. With the 5th page’s request, 100 items are rendered (80 previous items and 20 new items). The re-rendering of the previous 80 items are redundant and unnecessary.

So that’s where we decided to create our own Component which handles this problem and is also multi-purpose through different combinations of props.
## The solution…
After scratching our heads for a week and trying out different things, finally we came across React’s Recursive Components. There was an instinct that it could solve our problem. As the name suggests, a component rendered within the same component is called Recursive Component. With recursion, we achieved minimal re-rendering while loading the next pages.
## Visualization of the solution…
![recursive-lazy-visualization](recursive-lazy-visualization.png)

## Component’s Integration
```
<RecursivePagination 
	paginationEntityIds = {a plain array}
	getNextPageData = {data provider function}
	uniqueId = {unique identifier}
	nextButtonLabel = {button text}
	preCallback = {function to call before loading}
	postCallback = {function to call after loading}
	isAutoLoad = {next page to be loaded lazily}
	bottomOffset = {offset of autoloading}
	LazyComponent={<YourComponent {...props} />}
/>
```
## Props Details
| Prop | Description | Type | Default value | Is it required? |
| ---- | --------------------------- | ---- | ------------- | --------------- |
| LazyComponent | It is the page’s Component which we need to repeat. | React Component | - | Yes |
| paginationEntityIds | This prop is an array of page IDs/page numbers. | Plain array | Empty array | Yes |
| getNextPageData | API call for the next page is made in this function. It returns a Promise. | Function | - | Yes |
| nextButtonLabel | It’s the label of the next button. | String | ‘Load More’ | No |
| uniqueId | Unique identifier for the Component. | String | - | No |
| preCallback | A callback which is called just before making an API call for the next page. | Function | - | No |
| postCallback | A callback which is called just after the API call is resolved. | Function | - | No |
| isAutoLoad | A flag which tells the component to load the next page automatically when bottom is reached keeping a margin. | Boolean | False | No |
| bottomOffset | It’s the margin to keep when the isAutoLoad prop is set to true. | String | ‘100px’ | No |
