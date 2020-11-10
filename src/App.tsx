import React from 'react'
import { Form } from 'antd'
import FormTable, { FormTableColumn } from './FormTable'

const dataSource = {
	list: [
		{
			general: 'General 1',
			select: 'a',
			hidden: 'Hidden 1',
			check: true,
			nested: {
				itemA: 'Nested item A 1',
				itemB: 'Nested item B 1',
			},
			uneditable: 'Uneditable 1',
		},
		{
			general: 'General 2',
			select: 'b',
			hidden: 'Hidden 2',
			check: false,
			nested: {
				itemA: 'Nested item A 2',
				itemB: 'Nested item B 2',
			},
			uneditable: 'Uneditable 2',
		},
	],
}

const columns: FormTableColumn[] = [
	{
		dataIndex: ['general'],
		title: 'General',
		inputType: 'input',
	},
	{
		dataIndex: ['select'],
		title: 'Select',
		inputType: 'select',
		inputProps: {
			options: [
				{ label: 'Select A', value: 'a' },
				{ label: 'Select B', value: 'b' },
			],
		},
	},
	{
		dataIndex: ['hidden'],
		title: 'Hidden',
		inputType: 'input',
		hidden: true,
	},
	{
		dataIndex: ['check'],
		title: 'Check',
		inputType: 'checkbox',
	},
	{
		dataIndex: ['nested', 'itemA'],
		title: 'Nested item A',
		inputType: 'input',
	},
	{
		dataIndex: ['nested', 'itemB'],
		title: 'Nested item B',
		inputType: 'input',
	},
	{
		dataIndex: ['uneditable'],
		title: 'Uneditable',
		inputType: 'static',
	},
]

function App() {
	const [form] = Form.useForm()

	return (
		<Form form={form} initialValues={dataSource}>
			<FormTable form={form} listNamePath="list" columns={columns} />
		</Form>
	)
}

export default App
