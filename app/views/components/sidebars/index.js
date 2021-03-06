import _ from 'lodash'
import React from 'react/addons'
import {State} from 'react-router'

// Components
import MenuSidebar from './menu'
import FiltersSidebar from './filters'
import SearchSidebar from './search'

// Flux
import SidebarConstants from '../../../constants/sidebar-constants'
import ProductStore from '../../../stores/product-store'
import FiltersStore from '../../../stores/filters-store'
import SidebarStore from '../../../stores/sidebar-store'

let getStateFromStores = function(id) {
  var product = ProductStore.getProduct(id) || {}

  return _.assign({
    allFilters: FiltersStore.all(),
    activeFilters: FiltersStore.getActiveOrDefault(),
    filtersObject: FiltersStore.getFlatObject()
  }, product, SidebarStore.openState())
}

let Sidebars = React.createClass({

  mixins: [State],

  propTypes: {
    user: React.PropTypes.object.isRequired
  },

  getInitialState: function() {
    return getStateFromStores(this.getParams().id)
  },

  getLocation() {
    var pathName = this.getPathname()

    if (pathName.match('/search')) {
      return SidebarConstants.SEARCH
    } else {
      return SidebarConstants.FILTERS
    }
  },

  secondarySidebar() {
    let content
    let user = this.props.user

    switch (this.getLocation()) {
      case SidebarConstants.FILTERS:
        content = <FiltersSidebar {...this.state} user={user} />
        break
      case SidebarConstants.SEARCH:
        content = <SearchSidebar {...this.state} user={user} />
        break
      default:
        console.log('SIDEBARD CONTENT TYPE NOT HANDLED: ', this.props.type) // eslint-disable-line no-console
    }

    return content
  },

  onChange() {
    this.setState(getStateFromStores(this.getParams().id))
  },

  componentDidMount() {
    ProductStore.addChangeListener(this.onChange)
    FiltersStore.addChangeListener(this.onChange)
    SidebarStore.addChangeListener(this.onChange)
  },

  componentWillUnmount() {
    ProductStore.removeChangeListener(this.onChange)
    FiltersStore.removeChangeListener(this.onChange)
    SidebarStore.removeChangeListener(this.onChange)
  },

  render() {
    var sidebar = this.secondarySidebar()

    return (
      <div className="sprintly__sidebars">
        <MenuSidebar {...this.state} user={this.props.user} />
        {sidebar}
      </div>
    )
  }
})

export default Sidebars
