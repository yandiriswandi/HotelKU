'use client'
import { Card } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { ThumbsUp, MonitorCheck, ChartNoAxesCombined } from 'lucide-react'

export default function HomepageFeatureContainer() {
  return (
    <div className="container mx-auto flex justify-around items-center flex-col py-14">
      <p className="text-3xl font-semibold tracking-wider uppercase">
        Features
      </p>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }} // Mulai dari kecil dan transparan
        whileInView={{ opacity: 1, scale: 1 }} // Timbul ke ukuran normal
        transition={{ duration: 0.5, ease: 'easeOut' }}
        viewport={{ once: false, amount: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-10"
      >
        <Card>
          <div className="flex justify-center items-center flex-col p-6">
            <ThumbsUp size={48} strokeWidth={1.5} />
            <p className="text-md md:text-xl mt-2 font-semibold text-center">
              Simplicity
            </p>
            <p className="mt-4">
              Designed with clarity in mind, our application keeps things
              simple.
            </p>
          </div>
        </Card>
        <Card>
          <div className="flex justify-center items-center flex-col p-6">
            <MonitorCheck size={48} strokeWidth={1.5} />
            <p className="text-md md:text-xl mt-2 font-semibold text-center">
              Dashboard Management
            </p>
            <p className="mt-4">
              Take control with a powerful, centralized dashboard.
            </p>
          </div>
        </Card>
        <Card>
          <div className="flex justify-center items-center flex-col p-6">
            <ChartNoAxesCombined size={48} strokeWidth={1.5} />
            <p className="text-md md:text-xl mt-2 font-semibold text-center">
              Easy Tracking
            </p>
            <p className="mt-4">
              Stay updated with real-time insights and progress tracking.
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
