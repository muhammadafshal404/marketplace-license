import ObjectID from 'mongodb';
import decodeOpaqueId from "@reactioncommerce/api-utils/decodeOpaqueId.js";
console.log("ObjectId", ObjectID)
export default {
	Mutation: {
		async createLicense(parent, args, context, info){
			try{
				console.log("createLicense", args);
				let { description, productId, price } = args.input;
				let { Licenses } = context.collections;
				let decodedProductId = decodeOpaqueId(productId)?.id
				let data = {
					productId: decodedProductId,
					description: description,
					price: price
				}
				let insertedLicense = await Licenses.insertOne(data);
				console.log("insertedLicense", insertedLicense)
			} catch(err) {
				console.log("Error", err);
				return {
					success: false,
					message: `Server Error ${err}`,
					status: 500
				}
			}
		},
		async deleteLicense(parent, args, context, info){
			try{
				let { licenseId } = args;
				console.log("deleteLicense", args);
				let { Licenses } = context.collections;
				// let decodedProductId = decodeOpaqueId(productId)?.id
				let data = {
					_id: ObjectID.ObjectId(licenseId)
				}
				let deletedLicense = await Licenses.remove(data);
				console.log("deletedLicense", deletedLicense, deletedLicense?.result?.n)
				if( deletedLicense?.result?.n > 0 ) 
					return { success: true, message: "Successfully deleted!!", status: 200 }
				else return {
					success: false,
					message: "Sorry couldn't deleted!!",
					status: 200
				}
			} catch(err) {
				console.log("Error", err);
				return {
					success: false,
					message: `Server Error ${err}`,
					status: 500
				}
			}
		}
	},
	Query: {
		async getProductLicenses(parent, args, context, info){
			try{
				console.log("getProductLicenses", args);
				let { productId } = args;
				let { Licenses } = context.collections;
				let decodedProductId = decodeOpaqueId(productId)?.id
				let data = {
					productId: decodedProductId,
				}
				let productLicenses = await Licenses.find(data).toArray();
				console.log("productLicenses", productLicenses)
				if( productLicenses?.length )
					return {
						licenses: productLicenses,
						response: {
							success: true,
							message: "Data found.",
							status: 200
						}
					}
				else return {
					licenses: productLicenses,
					response: {
						success: false,
						message: "Data not found.",
						status: 200
					}
				}
			} catch(err) {
				console.log("Error", err);
				return {
					licenses: null,
					response: {
						success: false,
						message: "Server Error.",
						status: 500
					}
				}
			}
		}
	}
}