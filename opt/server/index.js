const { GraphQLServer } = require('graphql-yoga')
const mongoose = require('mongoose')

mongoose.connect(
	'mongodb://localhost:27017/contact-list',
	{
		useNewUrlParser: true
	}
)

const Contact = mongoose.model('contacts', {
	firstname: String,
	lastname: String,
	phone: String,
	createdAt: String,
	lastModified: String
})

const typeDefs = `
  type Contact {
    id: ID!
    firstname: String!
    lastname: String!
    phone: String!
    createdAt: String!
    lastModified: String!
  }

  type Query {
    contacts(n:Int): [Contact]
    contact(firstname: String!): Contact
  }
 
  type Mutation {
    createContact(
			firstname: String!,
			lastname: String!,
			phone: String!
		): Contact

		updateContact(
			id: ID!,
			firstname: String!,
			lastname: String!,
			phone: String!
		): Contact
		
    removeContact(id: ID!): ID!
  }
`

const resolvers = {
	Query: {
		contacts: async (_, { n }) => {
			if (!n) n = 100
			const contacts = await Contact.find({}).limit(n)
			if (contacts.length) return contacts
		},
		contact: async (_, { firstname }) => {
			const contact = await Contact.findOne({ firstname })
			if (contact) return contact
		}
	},
	Mutation: {
		createContact: async (_, { firstname, lastname, phone }) => {
			let date = new Date().toJSON()
			const contact = new Contact({
				firstname,
				lastname,
				phone,
				createdAt: date,
				lastModified: date
			})
			await contact.save()
			return contact
		},
		updateContact: async (_, { id, firstname, lastname, phone }) => {
			let _id = await Contact.findByIdAndUpdate(id, {
				firstname,
				lastname,
				phone,
				lastModified: new Date().toJSON()
			})
			return await Contact.findOne({ _id })
		},
		removeContact: async (_, { id }) => {
			let _id = await Contact.findByIdAndRemove(id)
			return id
		}
	}
}

const server = new GraphQLServer({ typeDefs, resolvers })

mongoose.connection.once('open', () => {
	server.start(() => console.log('Server is running on localhost:4000'))
})
