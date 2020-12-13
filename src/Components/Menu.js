import React, { Component } from "react";
import MenuObj from "../MenuObj";

class Subcategory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newItem: "",
    };
  }
  render() {
    return (
      <div style={styles.subCategoryDiv}>
        <view style={{display: "flex", flex: 1, flexDirection: "row"}}>
        <button
          style={this.props.hovered ? styles.hoveredMenu : styles.menu}
          onClick={this.props.onClick}
        >
          {this.props.data.name}
          </button>
          <button
            onClick={() => this.props.removeCategory(this.props.data.name)}
          >
            Remove
        </button>
        </view>
        {this.props.toRender && (
          <div>
            {this.props.data.menuItems.map((element) => (
              <div>
                <p style={styles.menuItems}>{element}</p>
                <button
                  onClick={() =>
                    this.props.removeMenuItem(this.props.data.name, element)
                  }
                >
                  Remove
                </button>
              </div>
            ))}
            <div>
              <input
                placeholder="Item Name"
                onChange={(e) => this.setState({ newItem: e.target.value })}
                value={this.state.newItem}
              />
              <button
                onClick={() => {
                  this.props.addMenuItem(
                    this.props.data.name,
                    this.state.newItem
                  );
                }}
              >
                Add Item
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
}

class Menu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hoveredSubmenu: -1,
      renderedSubmenu: -1,
      data: null,
      newCatName: "",
      currentIdx: this.props.currentNum - 1,
    };
  }

  async componentDidMount() {
    this.menuObj = new MenuObj({ menu: null});
    this.menuObj.setKey("Menu")
    await this.menuObj.load();
    console.log("menu is: " + this.menuObj.toString());
    if (!this.menuObj.menu) {
      console.log("making a menu");
      this.menuObj.setMenu({
        menu: {
          options: [
            {
              name: "Breakfast",
              menuItems: ["Pancake", "Cheese"],
            },
            {
              name: "Lunch",
              menuItems: ["Sandwich", "Soup"],
            },
            {
              name: "Dinner",
              menuItems: ["Pasta", "Chicken"],
            },
          ],
        },
      });
      this.menuObj.setKey("Menu")
      await this.menuObj.save();
      await this.menuObj.load();
      console.log("menu is: " + this.menuObj.toString());
    }
    this.sidesMenuObj = new MenuObj({ menu: null});
    this.sidesMenuObj.setKey("SidesMenu")
    await this.sidesMenuObj.load();
    console.log("menu is: " + this.sidesMenuObj.toString());
    if (!this.sidesMenuObj.menu) {
      console.log("making a menu");
      this.sidesMenuObj.setMenu({
        menu: {
          options: [
            {
              name: "French Fries",
              menuItems: [],
            },
            {
              name: "Pancakes",
              menuItems: [],
            },
            {
              name: "Two Eggs",
              menuItems: [],
            },
          ],
        },
      });
      this.sidesMenuObj.setKey("SidesMenu")
      await this.sidesMenuObj.save();
      await this.sidesMenuObj.load();
      console.log("sidesMenu is: " + this.sidesMenuObj.toString());
    }
    this.setState({
      data: this.menuObj.menu,
      sides: this.sidesMenuObj.menu
    });
  }

  addMenuItem = (cat, item) => {
    this.menuObj.addMenuItem(cat, item);
    this.setState({ data: this.menuObj.menu });
  };

  removeMenuItem = (cat, item) => {
    this.menuObj.removeMenuItem(cat, item);
    this.setState({ data: this.menuObj.menu });
  };

  openCategory = (nthCategory) => {
    let numCategories = this.state.data.length;
    if (nthCategory > numCategories) {
      console.log("Invalid Category");
      return;
    }
    this.setState({
      renderedSubmenu: nthCategory,
    });
    console.log(this.state.renderedSubmenu);
  };

  handleGestures() {
    if (this.props.currentNum !== 0) {
      this.state.hoveredSubmenu = this.props.currentNum - 1;
    }
    this.props.classNums.forEach((num) => {
      if (num === 3) {
        this.state.renderedSubmenu = this.state.hoveredSubmenu;
      }
    });
  }

  render() {
    this.handleGestures()
    return (
      <div>
        {this.state.data != null && (
          <div>
            {this.state.data.options.map((object, index) => {
              return (
                <Subcategory
                  data={object}
                  toRender={this.state.renderedSubmenu === index}
                  onClick={() => {
                    this.setState({ renderedSubmenu: index });
                  }}
                  menuObj={this.menuObj}
                  addMenuItem={this.addMenuItem}
                  removeMenuItem={this.removeMenuItem}
                  removeCategory={(cat) => this.menuObj.removeCategory(cat)}
                  hovered={this.state.hoveredSubmenu===index}
                />
              );
            })}
          </div>
        )}
        <div>
          <input
            placeholder="Category Name"
            onChange={(e) => this.setState({ newCatName: e.target.value })}
            value={this.state.newCatName}
          />
          <button
            onClick={() => {
              this.menuObj.addCategory(this.state.newCatName);
              this.setState({ data: this.menuObj.menu });
            }}
          >
            Add Category
          </button>
        </div>
        {this.state.sides != null && (
          <div>
            {this.state.sides.options.map((object, index) => {
              return (
                <Subcategory
                  data={object}
                  toRender={this.state.renderedSubmenu === index}
                  onClick={() => {
                    this.setState({ renderedSubmenu: index });
                  }}
                  menuObj={this.menuObj}
                  addMenuItem={this.addMenuItem}
                  removeMenuItem={this.removeMenuItem}
                  removeCategory={(cat) => this.menuObj.removeCategory(cat)}
                  hovered={this.state.hoveredSubmenu===index}
                />
              );
            })}
          </div>
        )}
      </div>
    );
  }
}

export default Menu;

const styles = {
  subCategoryDiv: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexDirection: "column",

  },
  menu: {
    textAlign: "center",
    color: "#3DC4BB",
    fontSize: "1.5em",
  },
  hoveredMenu: {
    textAlign: "center",
    backgroundColor: "#3DC4BB",
    color: "#ffffff",
    fontSize: "1.5em",
  },
  menuItems: {
    margin: "2px",
    padding: "1px",
    textAlign: "center",
  },
};
