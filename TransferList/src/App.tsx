import { useState } from 'react'
import TransferList from './component/TransferList/TransferList'
import type { TransferListItem } from './types/listTypes'

function App() {
  // Sample data for the transfer list
  const [leftItems, setLeftItems] = useState<TransferListItem[]>([
    { id: 1, label: 'Item 1' },
    { id: 2, label: 'Item 2' },
    { id: 3, label: 'Item 3' },
    { id: 4, label: 'Item 4 (Disabled)', disabled: true },
    { id: 5, label: 'Item 5' },
    { id: 6, label: 'Item 6' },
    { id: 7, label: 'Item 7' },
    { id: 8, label: 'Item 8' },
  ])

  const [rightItems, setRightItems] = useState<TransferListItem[]>([
    { id: 9, label: 'Pre-selected Item 1' },
    { id: 10, label: 'Pre-selected Item 2' },
  ])

  const handleItemsChange = (newLeftItems: TransferListItem[], newRightItems: TransferListItem[]) => {
    setLeftItems(newLeftItems)
    setRightItems(newRightItems)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Transfer List Demo
        </h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6">
          <TransferList
            leftItems={leftItems}
            rightItems={rightItems}
            onItemsChange={handleItemsChange}
            leftTitle="Available Items"
            rightTitle="Selected Items"
            height="300px"
            width="250px"
            showSelectAll={true}
            buttonVariant="contained"
            dense={false}
          />
        </div>

        <div className="mt-8 text-center text-sm text-gray-600">
          <p>Use the transfer buttons to move items between lists</p>
          <p>Disabled items cannot be moved or selected</p>
        </div>
      </div>
    </div>
  )
}

export default App