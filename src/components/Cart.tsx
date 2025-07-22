import React from 'react';
import { ShoppingCart, Minus, Plus, Trash2 } from 'lucide-react';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
}

const Cart: React.FC<CartProps> = ({ isOpen, onClose }) => {
  const [cartItems, setCartItems] = React.useState<any[]>([]);

  React.useEffect(() => {
    const items = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartItems(items);
  }, [isOpen]);

  const updateQuantity = (productId: number, change: number) => {
    const updatedItems = cartItems.map(item => {
      if (item.id === productId) {
        const newQuantity = Math.max(1, item.quantity + change);
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    setCartItems(updatedItems);
    localStorage.setItem('cart', JSON.stringify(updatedItems));
  };

  const removeItem = (productId: number) => {
    const updatedItems = cartItems.filter(item => item.id !== productId);
    setCartItems(updatedItems);
    localStorage.setItem('cart', JSON.stringify(updatedItems));
  };

  const total = cartItems.reduce((sum, item) => {
    const price = item.discountPercentage > 0
      ? item.price * (1 - item.discountPercentage / 100)
      : item.price;
    return sum + (price * item.quantity);
  }, 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
      <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-lg">
        <div className="p-4 flex justify-between items-center border-b">
          <h2 className="text-xl font-semibold flex items-center">
            <ShoppingCart className="h-6 w-6 mr-2" />
            Sepetim
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            &times;
          </button>
        </div>

        <div className="p-4 h-[calc(100vh-200px)] overflow-y-auto">
          {cartItems.length === 0 ? (
            <p className="text-center text-gray-500">Sepetiniz boş</p>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center space-x-4 border-b pb-4">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.name}</h3>
                    <div className="flex items-center mt-2">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="p-1 text-gray-500 hover:text-gray-700"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="mx-2">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="p-1 text-gray-500 hover:text-gray-700"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      {item.discountPercentage > 0
                        ? (item.price * (1 - item.discountPercentage / 100)).toFixed(2)
                        : item.price.toFixed(2)} TL
                    </p>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-500 hover:text-red-700 mt-2"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-white">
          <div className="flex justify-between items-center mb-4">
            <span className="font-semibold">Toplam:</span>
            <span className="text-xl font-bold">{total.toFixed(2)} TL</span>
          </div>
          <button
            onClick={() => window.location.href = '/checkout'}
            disabled={cartItems.length === 0}
            className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 disabled:bg-gray-400"
          >
            Ödemeye Geç
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;