import PropTypes from "prop-types"

/**
 * A highly reusable list component that renders a list of items
 *
 * @param {Object} props - Component props
 * @param {Array} props.items - Array of items to render
 * @param {Function} props.renderItem - Function to render each item
 * @param {Function} props.keyExtractor - Function to extract a unique key for each item
 * @param {string} [props.listClassName] - Optional CSS class for the list container
 * @param {string} [props.itemClassName] - Optional CSS class for each list item
 * @param {string} [props.listType] - Type of list element to use ('ul' or 'ol')
 * @param {Object} [props.listProps] - Additional props to pass to the list element
 * @param {JSX.Element} [props.emptyComponent] - Component to render when list is empty
 * @returns {JSX.Element} Rendered list component
 */
function ListComponent({
  items,
  renderItem,
  keyExtractor,
  listClassName = "",
  itemClassName = "",
  listType = "ul",
  listProps = {},
  emptyComponent,
}) {
  // Handle empty list case
  if (!items || items.length === 0) {
    return emptyComponent || null
  }

  const ListTag = listType

  return (
    <ListTag className={listClassName} {...listProps}>
      {items.map((item, index) => (
        <li key={keyExtractor ? keyExtractor(item) : index} className={itemClassName}>
          {renderItem(item, index)}
        </li>
      ))}
    </ListTag>
  )
}

ListComponent.propTypes = {
  items: PropTypes.array.isRequired,
  renderItem: PropTypes.func.isRequired,
  keyExtractor: PropTypes.func,
  listClassName: PropTypes.string,
  itemClassName: PropTypes.string,
  listType: PropTypes.oneOf(["ul", "ol"]),
  listProps: PropTypes.object,
  emptyComponent: PropTypes.element,
}

export default ListComponent
