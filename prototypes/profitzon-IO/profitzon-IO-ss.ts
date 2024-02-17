const data = {
  name: 'Client Name',
  workingCapitalLimit: 100,
  balance: 70,
  stores: [
    {
      id: 1,
      inventory: [
        {
          asin: 'B00XWZLJ32',
          name: 'Corelle Square Simple Lines 10.25” Dinner Plate (Set of 4)',
          price: 27.98,
        },
        {
          asin: 'B00GY4AIJ4',
          name: '4-3/4"WHT Dip Mini Dish (Pack of 6)',
          price: 32.20,
        }
      ],
      sales: {
        units: 0,
        gross: 0,
        net: 0,
        fees: {
          inbound: 0,
          warehouse: 0,

        }
      },
      profitSplit: 0.5
    },
    {
      id: 2,
      inventory: [
        {
          asin: 'B07H8Q3J9Y',
          name: 'Amazon Echo (3rd generation)',
          price: 99.99,
        },
        {
          asin: 'B07H8Q4GHL',
          name: 'Amazon Alexa (2nd generation)',
          price: 199.99,
        }
      ],
      sales: 400,
      profitSplit: 0.5
    }
  ]
};

const clientName = data.name; //?
const workingCapitalLimit = data.workingCapitalLimit; //?
const balance = data.balance; //?
const stores = data.stores; //?
const inventory = stores.map(store => store.inventory); //?
const asins = inventory.map(inventory => inventory.map(item => item.asin)); //?
const productNames = inventory.map(inventory => inventory.map(item => item.name)); //?
const prices = inventory.map(inventory => inventory.map(item => item.price)); //?