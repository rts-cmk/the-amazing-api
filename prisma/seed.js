import prisma from "../config/prisma.js"

async function main() {
	const [admin, editor, user] = await Promise.all([
		prisma.user.create({
			data: {
				email: "admin@mail.com",
				password: "admin",
				role: "ADMIN",
			},
		}),
		prisma.user.create({
			data: {
				email: "editor@mail.com",
				password: "editor",
				role: "EDITOR",
			},
		}),
		prisma.user.create({
			data: {
				email: "user@mail.com",
				password: "user",
				role: "USER", // optional if your schema defaults to USER
			},
		}),
	])

	const images = await Promise.all([
		prisma.media.create({
			data: {
				name: "The Thing",
				description: "Action figure of The Thing in the original box",
				type: "IMAGE",
				width: 1200,
				height: 1200,
				mimetype: "image/webp",
				size: 139264,
				originalFilename: "the-thing-package.webp",
				filename: "the-thing-package.webp",
				url: "http://localhost:4000/media/the-thing-package.webp",
			},
		}),
		prisma.media.create({
			data: {
				name: "The Thing",
				description: "Action figure of The Thing posing with a wide stance and one fist in the air",
				type: "IMAGE",
				width: 768,
				height: 768,
				mimetype: "image/jpeg",
				size: 61440,
				originalFilename: "the-thing.jpg",
				filename: "the-thing.jpg",
				url: "http://localhost:4000/media/the-thing.jpg",
			},
		}),
	])

	const product = await prisma.product.create({
		data: {
			name: "The Thing",
			description: "Action figure of The Thing in the original box",
			slug: "the-thing",
			sku: "123456",
			price: 29.99,
			saleprice: 19.99,
			weight: 1.5,
			height: 12,
			width: 12,
			length: 12,
			stock: 10,
			Media: {
				connect: {
					id: images[0].id,
				},
			}
		},
	})

	const post = await prisma.post.create({
		data: {
			title: "My first post",
			slug: "my-first-post",
			published: new Date(Date.now() + 3000).toISOString(),
			author: {
				connect: {
					id: editor.id,
				},
			},
			blocks: {
				create: [
					{
						"type": "HEADING",
						"content": {
							"level": 2,
							"text": "Hello, World!"
						},
						"position": 1
					},
					{
						"type": "TEXT",
						"content": {
							"spans": [
								{
									"text": "This is such an exciting ",
									"marks": []
								},
								{
									"text": "blog post",
									"marks": ["bold"]
								},
								{
									"text": ". Would you like to know ",
									"marks": []
								},
								{
									"text": "more",
									"marks": [
										{
											"type": "link",
											"href": "http://localhost:4000"
										}
									]
								},
								{
									"text": "?",
									"marks": []
								}
							]
						},
						"position": 2
					}
				]
			},
		},
	})

	console.log({ admin, editor, user, images, product, post })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
		process.exit(0)
  })