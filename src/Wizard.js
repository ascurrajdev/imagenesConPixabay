import React from 'react'
import PropTypes from 'prop-types'
import { Form } from 'react-final-form'

export default class Wizard extends React.Component {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired
  }
  static Page = ({ children }) => children

  constructor(props) {
    super(props)
    this.state = {
      page: 0,
      values: props.initialValues || {},
      urlImagen : ''
    }
  }
  next = values =>{
    
    this.setState(state => ({
      page: Math.min(state.page + 1, this.props.children.length - 1),
      values
    }))
  }

  previous = () =>
    this.setState(state => ({
      page: Math.max(state.page - 1, 0)
    }))


  validate = values => {
    const activePage = React.Children.toArray(this.props.children)[
      this.state.page
    ]
    return activePage.props.validate ? activePage.props.validate(values) : {}
  }

  handleSubmit = values => {
    const { children, onSubmit} = this.props
    const { page } = this.state
    const isLastPage = page === React.Children.count(children) - 1
    if (isLastPage) {
      return onSubmit(values)
    } else {
      this.next(values)
    }
  }

  render() {
    const { children } = this.props
    const { page, values } = this.state
    const activePage = React.Children.toArray(children)[page]
    const isLastPage = page === React.Children.count(children) - 1
    return (
      <Form
        initialValues={values}
        validate={this.validate}
        onSubmit={this.handleSubmit}
      >
        {({ handleSubmit,submitting, values }) => (
          <form onSubmit={handleSubmit}>
            {activePage}
            
            <pre id="resul">{JSON.stringify(values, 0, 2)}</pre>
            <div className="Ubicar">
            {page > 0 && (
                <button type="button" className="botones" onClick={this.previous}>
                  « Previous
                </button>
              )}
              {!isLastPage && <button type="submit" className="botones">Next »</button>}
               {isLastPage && <button type="submit" className="botones">Enviar</button>}
               </div>
          </form>
        
        )}

      </Form>
    )
  }
}