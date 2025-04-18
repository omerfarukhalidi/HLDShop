import React from 'react'
import { columns, Payment } from '../_components/Datatable/columns'
import { DataTable } from '../_components/Datatable/data-table'
import { Metadata } from 'next'


export const metadata:Metadata={
  title:"Hakkında ",
  description:"Hakkında",
  robots:{
    index:false,
    follow:false,
  },
 
}

async function getData(): Promise<Payment[]> {
 
  return [
    {
      id: "728ed52f",
      amount: 100,
      product:"Ayakkabı",
      status: "pending",
      email: "m@example.com",
    },
    {
      id: "728ed52f",
      amount: 100,
      status: "pending",
      email: "m@example.com",
    },
    // ...
  ]
}

const AboutPage = async() => {
  const data = await getData()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    author: "omerfarukhalidi",
    isPublished: true,
    tags: [""]
  }

  return (
    <>
    <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    
   
    <div className="container mx-auto py-10 border mt-10 rounded-xl dark:border-slate-600">
    <DataTable columns={columns} data={data} />
  </div>
  </>
  )
}

export default AboutPage