import { notFound } from 'next/navigation'
import { Refrigerator } from 'lucide-react'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import EmptyState from '@/components/ui/EmptyState'
import Input from '@/components/ui/Input'
import PageHeader from '@/components/ui/PageHeader'
import { SkeletonList } from '@/components/ui/Skeleton'
import DialogDemo from './DialogDemo'

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="mb-3 text-xl font-semibold text-ink">{title}</h2>
      {children}
    </section>
  )
}

export default function StyleguidePage() {
  if (process.env.VERCEL_ENV === 'production') notFound()

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="Styleguide"
        description="Every UI component, in the current theme. Use the Style picker to compare."
      />

      <Section title="Buttons">
        <div className="flex flex-wrap gap-2">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
          <Button size="lg">Large</Button>
          <Button disabled>Disabled</Button>
        </div>
      </Section>

      <Section title="Badges">
        <div className="flex flex-wrap gap-2">
          <Badge>Neutral</Badge>
          <Badge tone="accent">Accent</Badge>
          <Badge tone="success">Fresh</Badge>
          <Badge tone="warning">2d left</Badge>
          <Badge tone="danger">Expired</Badge>
        </div>
      </Section>

      <Section title="Card and inputs">
        <Card className="flex flex-col gap-4">
          <Input label="Ingredient name" placeholder="e.g. Eggs" hint="What's in your fridge?" />
          <Input label="Quantity" defaultValue="-2" error="Quantity must be more than 0" />
        </Card>
      </Section>

      <Section title="Dialog">
        <DialogDemo />
      </Section>

      <Section title="Empty state">
        <EmptyState
          icon={<Refrigerator size={40} />}
          title="Your fridge is empty"
          description="Add your first ingredient to start matching recipes."
          action={<Button>Add ingredient</Button>}
        />
      </Section>

      <Section title="Skeleton">
        <SkeletonList count={3} />
      </Section>
    </div>
  )
}
