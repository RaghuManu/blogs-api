const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");
const Joi = require("@hapi/joi");
const ExpressJoi = require("express-joi-validator");
const Contact = require("../models/contact");
const Subscribe = require("../models/subscribe");
const BusinessInfo = require("../models/clientBusiness");
const keys = require("./../config/keys");
const Login = require("../models/login");

const transportor = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: keys.sendgrid.key
    }
  })
);

const contactMeta = {
  body: Joi.object({
    name: Joi.string().required(),
    email: Joi.string()
      .email()
      .required(),
    message: Joi.string().required(),
    subject: Joi.string()
      .valid(
        "General Inquiry",
        "Advanced Marketing Program",
        "I Need Advice",
        "Consulting Inquiry",
        "Speaking Request"
      )
      .insensitive()
      .required()
  })
};

const loginMeta ={
  body: Joi.object({
    loginId: Joi.string().required(),
    password: Joi.string().required()
  })
};

const subscribeMeta = {
  body: Joi.object({
    name: Joi.string().required(),
    email: Joi.string()
      .email()
      .required(),
    subscribe_technology: Joi.array().default([]),
    
  })
};
/* 
const serviceAboutYouMeta = {
  body: Joi.object({
    name: Joi.string().required(),
    email: Joi.string()
      .email()
      .required(),
    mobile: Joi.string().required(),
    job: Joi.string().required()
  })
};

const serviceAboutYourBusinessMeta = {
  body: Joi.object({
    business_name: Joi.string().required(),
    service: Joi.string()
      .valid(
        "Website Development",
        "Mobile Application Development",
        "Search Engine Optimisation (SEO)",
        "Social Engine Marketing (Paid ads)",
        "Social Media Marketing (SMM)",
        "Website Analytics",
        "Training"
      ),
      webSiteURL : Joi.string()
      .insensitive()
      .required()
  })
}; */

const businessInfoMeta = {
  body: Joi.object({
    name: Joi.string().required(),
    email: Joi.string()
      .email()
      .required(),
    mobile: Joi.number().required(),
    job: Joi.string().required(),
    business_name: Joi.string(),
    service: Joi.string().valid(
      "Website Development",
      "Mobile Application Development",
      "Search Engine Optimisation",
      "Paid Search (Google Ads)",
      "Social Media Marketing",
      "Website Analytics",
      "Mobile Marketing"
    ),
    website_url: Joi.string().required()
  })
};

router.post(
  "/contact",
  ExpressJoi(contactMeta, { stripUnknown: true, allowUnknown: false }),
  async (req, res) => {
    console.log("request : contact")
    console.log(req.body)
    try {
      const name = req.body.name;
      const email = req.body.email;
      let result;
      const sub_msg = {
        subject: req.body.subject,
        message: req.body.message,
        sentDate: new Date(),
      };
      /**
       * Check requested email is present in DB
       * If present, add new subject and message to existing contact_details
       * Else create new record
       */
      const user = await Contact.findOne({ email});
      if (user) {
        user.contact_details = [...user.contact_details, sub_msg];
        result = await user.save();
      } else {
        result = await Contact.create({
          name,
          email,
          contact_details: [sub_msg]
        });
      }

       transportor.sendMail({
        to: email,
        from: "alfatroopblogs@gmail.com",
        subject: "Thank you for contacting us",
        html:
          "Hi " +
          `${name.charAt(0).toUpperCase() + name.slice(1)}` +
          ",<br>" +
          "Thanks for sending a query to us on " +
          '" ' +
          `${req.body.subject}` +
          ' ". <br><br>' +
          " You should receive an email from Team Alpha very shortly . <br><br><br><br>" +
          "Thanks <br>" +
          "Team Alpha <br>" +
          /*  "<a href=\"http://localhost:4200\">alfatroopblogs@gmail.com</a>" */
          '<a href="#">alfatroopblogs@gmail.com</a>'
      });
      return res.status(200).send(result);
    } catch (error) {
      console.log(error);
    }
  }
);

router.post(
  "/subscribe",
  ExpressJoi(subscribeMeta, { stripUnknown: true, allowUnknown: false }),
  async (req, res) => {
    console.log("request : subscribe")
    console.log(req.body)
    try {
      /**
       * Check requested email is present in DB
       * If present, update details
       * Else create new record
       */
      const result = await Subscribe.findOneAndUpdate(
        { email: req.body.email },
        {
          name: req.body.name,
          email: req.body.email,
          subscribe_technology: req.body.subscribe_technology
        },
        {
          new: true,
          upsert: true
        }
      );
      transportor.sendMail({
        to: req.body.email,
        from: "alfatroopblogs@gmail.com",
        subject: "Alpha Troop Blogs Subscription Completed",
        html:
          "<h3>Thankyou for subscription. You will be notify when we upload new blogs.</h3>" +
          "Thanks <br>" +
          "Team Alpha <br>" +
          /*  "<a href=\"http://localhost:4200\">alfatroopblogs@gmail.com</a>" */
          '<a href="#">alfatroopblogs@gmail.com</a>'
      });
      return res.status(200).send(result);
    } catch (error) {
      console.log(error);
    }
  }
);

router.post(
  '/login',
  ExpressJoi(loginMeta,{stripUnknown:true,allowUnknown: false}),
  async(req,res)=>{
    console.log("request : loginInfo")
    console.log(req.body)
    try{
        let result;
        const loginId = req.body.loginId;
        const password = req.body.password;
        const login = await Login.findOne({loginId});
        if(login){
          result = await login.save();
          
          return res.status(200).send({
            status : "200",
            message:"success",
          });
        } else {
          /* result = await Login.create({
            loginId,
            loginId: loginId,
            password: password
          });
 */
          return res.status(200).send({
            status : "200",
            message:"user already exists",
        });
        }
      }
    
    catch(error) {
      console.log(error);
      res.send({
        error:error
      })
    }
  });
router.post(
  "/businessInfo",
  ExpressJoi(businessInfoMeta, { stripUnknown: true, allowUnknown: false }),
  async (req, res) => {
    console.log("request : businessInfo")
    console.log(req.body)
    try {
      
      const email = req.body.email;
      let result;
      const business_info = {
        business_name: req.body.business_name,
        service: req.body.service,
        website_url: req.body.website_url,
        sentDate: new Date(),
      };

      /**
       * Check requested email is present in DB
       * If present, add new business_name,service and website_url to existing business_info
       * Else create new record
       */
      const business = await BusinessInfo.findOne({ email});
      if (business) {
        business.business_info = [...business.business_info, business_info];
        result = await business.save();
      } else {
        result = await BusinessInfo.create({
          email,
          name: req.body.name,
          mobile: req.body.mobile,
          job: req.body.job,
          business_info: [business_info],
         
        });
      }

      transportor.sendMail({
        to: email,
        from: "alfatroopblogs@gmail.com",
        subject: "Thank you for reaching to us.",
        html:
          "<h1>Thank you for reaching to us. </h1>" +
          "<h3>Our Team will reach you very shortly. </h3>" +
          "Thanks <br>" +
          "Team Alpha <br>" +
          /*  "<a href=\"http://localhost:4200\">alfatroopblogs@gmail.com</a>" */
          '<a href="#">alfatroopblogs@gmail.com</a>'
      });
      return res.status(200).send(result);
    } catch (error) {
      console.log(error);
    }
  }
);


router.post(
  "/getBusinessInfo",
  async (req, res) => {
    console.log("request : businessInfo")
    console.log(req.body)
    try {
      
     let result =await BusinessInfo.find();
      return res.status(200).send(result);
    } catch (error) {
      console.log(error);
    }
  }
);
router.post(
  "/getBusinessInfoById",
  async (req, res) => {
    console.log("request : businessInfo")
    console.log(req.body)
    let email = req.body.email;
    try {
      
     let result =await BusinessInfo.findOne({ email});
      return res.status(200).send(result);
    } catch (error) {
      console.log(error);
    }
  }
);
router.post(
  "/getContactInfo",
  async (req, res) => {
    console.log("request : businessInfo")
    console.log(req.body)
    try {
      
     let result =await Contact.find();
      return res.status(200).send(result);
    } catch (error) {
      console.log(error);
    }
  }
);

router.post(
  "/getContactInfoById",
  async (req, res) => {
    console.log("request : contactInfo")
    console.log(req.body)
    let email = req.body.email;
    try {
      
     let result =await Contact.findOne({ email});
      return res.status(200).send(result);
    } catch (error) {
      console.log(error);
    }
  }
);
module.exports = router;
