import React, { Fragment } from 'react';
import Helmet from 'react-helmet';
import { stringify } from 'qs';
import { serialize } from 'dom-form-serializer';

class Form extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: this.props.name,
      subject: '', // optional subject of the notification email
      action: '',
      successMessage: 'Thanks for your enquiry, we will get back to you soon',
      errorMessage: 'There is a problem, your message has not been sent, please try contacting us via email'
    };
  }

  static defaultProps = {
    name: 'Simple Form Ajax',
    subject: '', // optional subject of the notification email
    action: '',
    successMessage: 'Thanks for your enquiry, we will get back to you soon',
    errorMessage: 'There is a problem, your message has not been sent, please try contacting us via email'
  };

  state = {
    alert: '',
    disabled: false
  };

  handleSubmit = e => {
    e.preventDefault();

    if (this.state.disabled) return;

    const form = e.target;
    const data = serialize(form);

    this.setState({ disabled: true });

    fetch(form.action + '?' + stringify(data), {
      method: 'POST'
    })
      .then(res => {
        if (res.ok) {
          return res;
        } else {
          throw new Error('Network error');
        }
      })
      .then(() => {
        form.reset();
        this.setState({
          alert: this.props.successMessage,
          disabled: false
        });
      })
      .catch(err => {
        console.error(err);
        this.setState({
          disabled: false,
          alert: this.props.errorMessage
        });
      });
  };

  render() {
    const { subject, enquiryType = [] } = this.props;

    return (
      <Fragment>
        <Helmet>
          <script src="https://www.google.com/recaptcha/api.js" />
        </Helmet>
        <form
          className="Form m-0"
          onSubmit={this.handleSubmit}
          name="contact-form"
          data-netlify="true"
          data-netlify-honeypot="bot-field"
        >
          {this.state.alert && <div className="Form--Alert">{this.state.alert}</div>}
          <div className="Form--Group">
            <label className="Form--Label">
              <input
                className="Form--Input Form--InputText"
                type="text"
                placeholder="Firstname"
                name="firstname"
                required
              />
              <span>Firstname</span>
            </label>
            <label className="Form--Label">
              <input
                className="Form--Input Form--InputText"
                type="text"
                placeholder="Lastname"
                name="lastname"
                required
              />
              <span>Lastname</span>
            </label>
          </div>
          <label className="Form--Label">
            <input
              className="Form--Input Form--InputText"
              type="email"
              placeholder="Email"
              name="emailAddress"
              required
            />
            <span>Email address</span>
          </label>
          <label className="Form--Label has-arrow">
            <select className="Form--Input Form--Select" name="type" defaultValue="Type of Enquiry" required>
              <option disabled hidden>
                Type of Enquiry
              </option>
              {enquiryType.length && enquiryType.map((et, i) => <option key={`${et.type}-${i}`}>{et.type}</option>)}
            </select>
          </label>
          <label className="Form--Label">
            <textarea
              className="Form--Input Form--Textarea Form--InputText"
              placeholder="Message"
              name="message"
              rows="10"
              required
            />
            <span>Message</span>
          </label>
          <label className="Form--Label Form-Checkbox">
            <input className="Form--Input Form--Textarea Form--CheckboxInput" name="newsletter" type="checkbox" />
            <span>Get news updates</span>
          </label>
          {!!subject && <input type="hidden" name="subject" value={subject} />}
          <input type="hidden" name="form-name" value="contact-form" />
          <input className="Button Form--SubmitButton" type="submit" value="Enquire" disabled={this.state.disabled} />
        </form>
      </Fragment>
    );
  }
}

export default Form;
