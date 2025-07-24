'use client'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { Search } from 'lucide-react'
import Link from 'next/link'

export default function HomepageMainContainer() {
  return (
    <div className="mx-auto flex min-h-screen justify-around items-center py-14 bg-[url('/images/background.jpg')] bg-cover bg-center">
      <div className="flex justify-center items-center flex-col">
        <motion.p
          initial={{ opacity: 0, y: -50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: false, amount: 0.5 }}
          className="text-8xl mb-8 font-semibold text-center text-white"
        >
          Book Your Luxury Room
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: -50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: false, amount: 0.5 }}
          className="text-2xl mb-8 text-center text-white"
        >
          Get special Offer just for you today
        </motion.p>
        <div className="flex gap-4">
          <motion.div
            initial={{ opacity: 0, x: -100 }} // Mulai dari kanan (100px ke kanan)
            whileInView={{ opacity: 1, x: 0 }} // Bergerak ke posisi semula
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: false, amount: 0.5 }}
          >
            <Link href="#jobs" target="_self">
              <Button size="lg" className="font-semibold">
                Explore Room <Search />
              </Button>
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 100 }} // Mulai dari kanan (100px ke kanan)
            whileInView={{ opacity: 1, x: 0 }} // Bergerak ke posisi semula
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: false, amount: 0.5 }}
          >
            <Link
              href="https://wa.me/6285951393322"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                size="lg"
                variant="ghost"
                className="border border-primary text-white hover:bg-primary hover:text-white font-semibold"
              >
                Contact Us
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
